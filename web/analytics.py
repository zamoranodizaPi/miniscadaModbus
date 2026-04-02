from __future__ import annotations

from collections import defaultdict
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone

from sqlalchemy import Select, and_, desc, func, select

from models.entities import Device, Reading, Variable


POWER_VARIABLE = "potencia_activa_kw"
ENERGY_VARIABLE = "energia_acumulada_kwh"
VOLTAGE_VARIABLE = "voltaje_ll_v"
CURRENT_VARIABLE = "corriente_total_a"
DEVICE_STATUS_VARIABLES = {"estado_interruptor", "alarma_general", "mantenimiento_activo", "tablero_energizado"}
PRIMARY_VARIABLES = {
    POWER_VARIABLE,
    ENERGY_VARIABLE,
    VOLTAGE_VARIABLE,
    CURRENT_VARIABLE,
    "frecuencia_hz",
    "factor_potencia",
}


@dataclass(slots=True)
class HistoryFilters:
    device_id: int | None = None
    variable_name: str | None = None
    start: datetime | None = None
    end: datetime | None = None


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


def parse_date_range(start_value: str | None, end_value: str | None, default_days: int = 7) -> tuple[datetime, datetime]:
    end = utcnow()
    start = end - timedelta(days=default_days)
    if start_value:
        start = datetime.fromisoformat(start_value).replace(tzinfo=timezone.utc)
    if end_value:
        end = datetime.fromisoformat(end_value).replace(tzinfo=timezone.utc) + timedelta(days=1)
    return start, end


def latest_readings_stmt(device_id: int | None = None, variable_names: set[str] | None = None) -> Select:
    latest_ts = select(Reading.variable_id, func.max(Reading.timestamp).label("max_timestamp")).group_by(Reading.variable_id).subquery()
    stmt = (
        select(
            Device.id.label("device_id"),
            Device.name.label("device_name"),
            Device.enabled.label("device_enabled"),
            Device.last_error.label("last_error"),
            Device.last_seen_at.label("last_seen_at"),
            Variable.id.label("variable_id"),
            Variable.name.label("variable_name"),
            Reading.value.label("value"),
            Reading.raw_value.label("raw_value"),
            Reading.timestamp.label("timestamp"),
        )
        .join(Variable, Variable.device_id == Device.id)
        .join(latest_ts, latest_ts.c.variable_id == Variable.id)
        .join(
            Reading,
            and_(Reading.variable_id == latest_ts.c.variable_id, Reading.timestamp == latest_ts.c.max_timestamp),
        )
        .where(Device.enabled.is_(True), Variable.enabled.is_(True))
        .order_by(Device.name, Variable.name)
    )
    if device_id:
        stmt = stmt.where(Device.id == device_id)
    if variable_names:
        stmt = stmt.where(Variable.name.in_(sorted(variable_names)))
    return stmt


def latest_readings_map(session, device_id: int | None = None) -> dict[int, dict[str, dict]]:
    rows = session.execute(latest_readings_stmt(device_id=device_id)).mappings().all()
    result: dict[int, dict[str, dict]] = defaultdict(dict)
    for row in rows:
        result[row["device_id"]][row["variable_name"]] = dict(row)
    return result


def build_dashboard_snapshot(session, device_id: int | None = None) -> dict:
    metric_rows = session.execute(latest_readings_stmt(device_id=device_id)).mappings().all()
    all_devices = session.scalars(select(Device).order_by(Device.name)).all()
    devices = [device for device in all_devices if not device_id or device.id == device_id]

    device_cards = []
    energy_breakdown = []
    latest_rows = []
    alerts = []

    total_power = 0.0
    total_energy = 0.0
    voltage_values: list[float] = []
    current_values: list[float] = []

    grouped: dict[int, dict[str, dict]] = defaultdict(dict)
    for row in metric_rows:
        grouped[row["device_id"]][row["variable_name"]] = dict(row)
        latest_rows.append(
            {
                "device": row["device_name"],
                "variable": row["variable_name"],
                "value": round(row["value"], 3),
                "timestamp": row["timestamp"].isoformat(),
            }
        )

    for device in devices:
        metrics = grouped.get(device.id, {})
        power = as_float(metrics.get(POWER_VARIABLE, {}).get("value"))
        energy = as_float(metrics.get(ENERGY_VARIABLE, {}).get("value"))
        voltage = as_float(metrics.get(VOLTAGE_VARIABLE, {}).get("value"))
        current = as_float(metrics.get(CURRENT_VARIABLE, {}).get("value"))
        breaker = as_bool(metrics.get("estado_interruptor", {}).get("value"))
        alarm = as_bool(metrics.get("alarma_general", {}).get("value"))
        energized = as_bool(metrics.get("tablero_energizado", {}).get("value"))
        maintenance = as_bool(metrics.get("mantenimiento_activo", {}).get("value"))

        total_power += power
        total_energy += energy
        if voltage:
            voltage_values.append(voltage)
        if current:
            current_values.append(current)

        utilization = round(min(100.0, max(0.0, power / max(1.0, power * 1.25) * 100.0)), 1) if power else 0.0
        device_cards.append(
            {
                "id": device.id,
                "name": device.name,
                "power_kw": round(power, 2),
                "energy_kwh": round(energy, 2),
                "voltage_v": round(voltage, 2),
                "current_a": round(current, 2),
                "breaker_closed": breaker,
                "energized": energized,
                "alarm": alarm,
                "maintenance": maintenance,
                "last_seen_at": device.last_seen_at.isoformat() if device.last_seen_at else None,
                "last_error": device.last_error,
                "utilization_pct": utilization,
            }
        )

        if energy:
            energy_breakdown.append({"device": device.name, "energy_kwh": round(energy, 2)})
        if alarm or device.last_error:
            alerts.append(
                {
                    "device": device.name,
                    "message": device.last_error or "Alarma general activa",
                    "severity": "danger" if device.last_error else "warning",
                }
            )

    trend_series = build_power_timeseries(session, device_id=device_id, hours=3)
    daily_rows = energy_aggregate(session, period="daily", device_id=device_id, limit=14)
    monthly_rows = energy_aggregate(session, period="monthly", device_id=device_id, limit=12)

    return {
        "kpis": {
            "device_count": len([device for device in devices if device.enabled]),
            "online_devices": len([device for device in devices if device.enabled and not device.last_error]),
            "active_alerts": len(alerts),
            "total_energy_kwh": round(total_energy, 2),
            "total_power_kw": round(total_power, 2),
            "avg_voltage_v": round(sum(voltage_values) / len(voltage_values), 2) if voltage_values else 0.0,
            "avg_current_a": round(sum(current_values) / len(current_values), 2) if current_values else 0.0,
            "daily_energy_kwh": round(sum(item["energy_kwh"] for item in daily_rows if item["bucket"] == daily_rows[-1]["bucket"]), 2)
            if daily_rows
            else 0.0,
            "monthly_energy_kwh": round(sum(item["energy_kwh"] for item in monthly_rows if item["bucket"] == monthly_rows[-1]["bucket"]), 2)
            if monthly_rows
            else 0.0,
        },
        "devices": sorted(device_cards, key=lambda item: item["power_kw"], reverse=True),
        "energy_breakdown": sorted(energy_breakdown, key=lambda item: item["energy_kwh"], reverse=True),
        "trend": trend_series,
        "daily_energy": daily_rows,
        "monthly_energy": monthly_rows,
        "latest_rows": sorted(latest_rows, key=lambda item: item["timestamp"], reverse=True)[:24],
        "alerts": alerts[:8],
    }


def build_power_timeseries(session, device_id: int | None = None, hours: int = 3) -> list[dict]:
    since = utcnow() - timedelta(hours=hours)
    bucket = func.strftime("%Y-%m-%dT%H:%M:00", Reading.timestamp)
    stmt = (
        select(bucket.label("bucket"), func.sum(Reading.value).label("power_kw"))
        .join(Reading.variable)
        .join(Variable.device)
        .where(
            Reading.timestamp >= since,
            Variable.name == POWER_VARIABLE,
            Variable.enabled.is_(True),
            Device.enabled.is_(True),
        )
        .group_by("bucket")
        .order_by("bucket")
    )
    if device_id:
        stmt = stmt.where(Device.id == device_id)
    rows = session.execute(stmt).all()
    return [{"timestamp": bucket_value, "power_kw": round(float(power_kw or 0.0), 2)} for bucket_value, power_kw in rows]


def energy_aggregate(
    session,
    period: str,
    device_id: int | None = None,
    start: datetime | None = None,
    end: datetime | None = None,
    limit: int | None = None,
) -> list[dict]:
    start = start or (utcnow() - timedelta(days=30 if period == "daily" else 365))
    end = end or utcnow()
    bucket_expr = func.date(Reading.timestamp) if period == "daily" else func.strftime("%Y-%m", Reading.timestamp)

    stmt = (
        select(
            bucket_expr.label("bucket"),
            Device.name.label("device_name"),
            (func.max(Reading.value) - func.min(Reading.value)).label("energy_kwh"),
        )
        .join(Reading.variable)
        .join(Variable.device)
        .where(
            Variable.name == ENERGY_VARIABLE,
            Reading.timestamp >= start,
            Reading.timestamp <= end,
            Device.enabled.is_(True),
            Variable.enabled.is_(True),
        )
        .group_by("bucket", Device.name)
        .order_by(desc("bucket"), Device.name)
    )
    if device_id:
        stmt = stmt.where(Device.id == device_id)
    if limit:
        stmt = stmt.limit(limit * 16)
    rows = session.execute(stmt).all()
    data = [{"bucket": bucket, "device": device_name, "energy_kwh": round(max(float(energy_kwh or 0.0), 0.0), 2)} for bucket, device_name, energy_kwh in rows]
    data.sort(key=lambda item: (item["bucket"], item["device"]))
    return data


def total_energy_summary(session, device_id: int | None = None) -> dict:
    rows = session.execute(latest_readings_stmt(device_id=device_id, variable_names={ENERGY_VARIABLE})).mappings().all()
    total = sum(as_float(row["value"]) for row in rows)
    return {
        "total_energy_kwh": round(total, 2),
        "devices": [{"device": row["device_name"], "energy_kwh": round(as_float(row["value"]), 2)} for row in rows],
    }


def device_inventory(session) -> list[dict]:
    rows = session.scalars(select(Device).order_by(Device.name)).all()
    return [
        {
            "id": row.id,
            "name": row.name,
            "ip": row.ip,
            "port": row.port,
            "unit_id": row.unit_id,
            "enabled": row.enabled,
            "last_error": row.last_error,
            "last_seen_at": row.last_seen_at.isoformat() if row.last_seen_at else None,
            "poll_interval": row.poll_interval,
        }
        for row in rows
    ]


def variable_inventory(session) -> list[str]:
    rows = session.scalars(select(Variable.name).where(Variable.enabled.is_(True)).distinct().order_by(Variable.name)).all()
    return list(rows)


def history_rows(session, filters: HistoryFilters, page: int = 1, per_page: int = 100) -> dict:
    stmt = (
        select(Device.name, Variable.name, Reading.value, Reading.raw_value, Reading.timestamp)
        .join(Reading.variable)
        .join(Variable.device)
        .where(Device.enabled.is_(True), Variable.enabled.is_(True))
    )
    stmt = apply_history_filters(stmt, filters)

    total = session.scalar(select(func.count()).select_from(stmt.subquery())) or 0
    rows = session.execute(
        stmt.order_by(desc(Reading.timestamp)).offset((page - 1) * per_page).limit(per_page)
    ).all()
    return {
        "rows": [
            {
                "device": device_name,
                "variable": variable_name,
                "value": round(float(value), 3),
                "raw_value": raw_value,
                "timestamp": timestamp,
            }
            for device_name, variable_name, value, raw_value, timestamp in rows
        ],
        "pagination": {
            "page": page,
            "per_page": per_page,
            "total": total,
            "pages": max(1, (total + per_page - 1) // per_page),
        },
    }


def export_history_csv(session, filters: HistoryFilters) -> str:
    stmt = (
        select(Device.name, Variable.name, Reading.value, Reading.raw_value, Reading.timestamp)
        .join(Reading.variable)
        .join(Variable.device)
        .where(Device.enabled.is_(True), Variable.enabled.is_(True))
        .order_by(desc(Reading.timestamp))
    )
    stmt = apply_history_filters(stmt, filters)
    rows = session.execute(stmt).all()

    lines = ["device,variable,value,raw_value,timestamp"]
    for device_name, variable_name, value, raw_value, timestamp in rows:
        lines.append(f"{device_name},{variable_name},{value},{raw_value or ''},{timestamp.isoformat()}")
    return "\n".join(lines)


def apply_history_filters(stmt: Select, filters: HistoryFilters) -> Select:
    if filters.device_id:
        stmt = stmt.where(Device.id == filters.device_id)
    if filters.variable_name:
        stmt = stmt.where(Variable.name == filters.variable_name)
    if filters.start:
        stmt = stmt.where(Reading.timestamp >= filters.start)
    if filters.end:
        stmt = stmt.where(Reading.timestamp <= filters.end)
    return stmt


def as_float(value) -> float:
    try:
        return float(value or 0.0)
    except (TypeError, ValueError):
        return 0.0


def as_bool(value) -> bool:
    return bool(round(as_float(value)))
