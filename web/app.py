from __future__ import annotations

from datetime import timedelta
from io import StringIO

from flask import Flask, abort, flash, jsonify, make_response, redirect, render_template, request, url_for
from flask_login import LoginManager, current_user, login_required, login_user, logout_user
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from backend.bootstrap import bootstrap_from_config
from backend.config import get_settings
from backend.database import SessionLocal, session_scope
from backend.security import hash_password, verify_password
from models.entities import Device, Setting, User, Variable
from web.analytics import (
    HistoryFilters,
    KIOSK_VARIABLE_TABS,
    build_dashboard_snapshot,
    energy_aggregate,
    export_history_csv,
    history_rows,
    load_dashboard_preferences,
    parse_date_range,
    total_energy_summary,
    utcnow,
    variable_inventory,
    device_inventory,
)


settings = get_settings()
login_manager = LoginManager()
login_manager.login_view = "login"


def create_app() -> Flask:
    app = Flask(__name__, template_folder="templates", static_folder="static")
    app.config["SECRET_KEY"] = settings.secret_key

    bootstrap_from_config(settings.config_path)
    login_manager.init_app(app)

    @app.context_processor
    def inject_now():
        with session_scope() as session:
            preferences = load_dashboard_preferences(session)
        return {
            "now": utcnow(),
            "ui_preferences": preferences,
            "format_compact_value": format_compact_value,
            "format_compact_metric": format_compact_metric,
        }

    @app.route("/")
    @login_required
    def index():
        selected_device_ids = get_optional_int_list(request.args.getlist("device_id"))
        with session_scope() as session:
            snapshot = build_dashboard_snapshot(session, device_ids=selected_device_ids)
            devices = session.scalars(select(Device).order_by(Device.name)).all()
            variables = variable_inventory(session)
            preferences = load_dashboard_preferences(session)
        return render_template(
            "dashboard.html",
            snapshot=snapshot,
            devices=devices,
            variables=variables,
            selected_device_ids=selected_device_ids,
            preferences=preferences,
        )

    @app.route("/local")
    def local_dashboard():
        require_local_request()
        selected_device_ids = get_optional_int_list(request.args.getlist("device_id"))
        with session_scope() as session:
            snapshot = build_dashboard_snapshot(session, device_ids=selected_device_ids)
            devices = session.scalars(select(Device).where(Device.enabled.is_(True)).order_by(Device.name)).all()
            preferences = load_dashboard_preferences(session)
        return render_template("local_dashboard.html", snapshot=snapshot, devices=devices, selected_device_ids=selected_device_ids, kiosk_tabs=KIOSK_VARIABLE_TABS, preferences=preferences)

    @app.route("/api/dashboard/preferences", methods=["GET", "POST"])
    @login_required
    def api_dashboard_preferences():
        with session_scope() as session:
            if request.method == "POST":
                payload = request.get_json(silent=True) or {}
                current = load_dashboard_preferences(session)
                current["theme"] = payload.get("theme", current["theme"])
                current["mode"] = payload.get("mode", current["mode"])
                current["refresh_seconds"] = int(payload.get("refresh_seconds", current["refresh_seconds"]))
                current["kiosk_theme"] = payload.get("kiosk_theme", current["kiosk_theme"])
                current["kiosk_mode"] = payload.get("kiosk_mode", current["kiosk_mode"])
                visible_tabs = payload.get("visible_tabs", current["visible_tabs"])
                if isinstance(visible_tabs, list) and visible_tabs:
                    current["visible_tabs"] = visible_tabs
                upsert_setting(session, "dashboard_preferences", json_dumps(current))
                return jsonify(current)
            return jsonify(load_dashboard_preferences(session))

    @app.route("/login", methods=["GET", "POST"])
    def login():
        if current_user.is_authenticated:
            return redirect(url_for("index"))
        if request.method == "POST":
            username = request.form["username"].strip()
            password = request.form["password"]
            with session_scope() as session:
                user = session.scalar(select(User).where(User.username == username))
                if user and verify_password(password, user.password_hash):
                    login_user(user)
                    return redirect(url_for("index"))
            flash("Credenciales inválidas", "danger")
        return render_template("login.html")

    @app.route("/logout")
    @login_required
    def logout():
        logout_user()
        return redirect(url_for("login"))

    @app.route("/devices")
    @login_required
    def devices():
        with session_scope() as session:
            rows = session.scalars(select(Device).order_by(Device.name)).all()
        return render_template("devices.html", devices=rows)

    @app.route("/devices/new", methods=["GET", "POST"])
    @login_required
    def device_new():
        default_interval = get_setting_int("default_poll_interval", 10)
        if request.method == "POST":
            with session_scope() as session:
                session.add(
                    Device(
                        name=request.form["name"].strip(),
                        ip=request.form["ip"].strip(),
                        port=int(request.form.get("port", 502)),
                        unit_id=int(request.form.get("unit_id", 1)),
                        timeout=float(request.form.get("timeout", 3)),
                        poll_interval=int(request.form.get("poll_interval", default_interval)),
                        enabled=("enabled" in request.form),
                    )
                )
            return redirect(url_for("devices"))
        return render_template("device_form.html", device=None, default_poll_interval=default_interval)

    @app.route("/devices/<int:device_id>/edit", methods=["GET", "POST"])
    @login_required
    def device_edit(device_id: int):
        with session_scope() as session:
            device = session.get(Device, device_id)
            editing_variable_id = get_optional_int(request.args.get("edit_variable"))
            editing_variable = session.get(Variable, editing_variable_id) if editing_variable_id else None
            if editing_variable and editing_variable.device_id != device.id:
                editing_variable = None
            if request.method == "POST" and request.form.get("form_kind", "device") == "device":
                device.name = request.form["name"].strip()
                device.ip = request.form["ip"].strip()
                device.port = int(request.form.get("port", 502))
                device.unit_id = int(request.form.get("unit_id", 1))
                device.timeout = float(request.form.get("timeout", 3))
                device.poll_interval = int(request.form.get("poll_interval", 10))
                device.enabled = "enabled" in request.form
                session.add(device)
                return redirect(url_for("devices"))
            if request.method == "POST" and request.form.get("form_kind") == "variable":
                variable_id = get_optional_int(request.form.get("variable_id"))
                if variable_id:
                    variable = session.get(Variable, variable_id)
                    if variable is None or variable.device_id != device.id:
                        abort(404)
                else:
                    variable = Variable(device_id=device.id)
                updated = build_variable_from_form(request.form, forced_device_id=device.id)
                variable.device_id = updated.device_id
                variable.name = updated.name
                variable.address = updated.address
                variable.function_code = updated.function_code
                variable.data_type = updated.data_type
                variable.register_count = updated.register_count
                variable.scale = updated.scale
                variable.offset = updated.offset
                variable.byte_order = updated.byte_order
                variable.word_order = updated.word_order
                variable.enabled = updated.enabled
                session.add(variable)
                flash("Variable guardada", "success")
                return redirect(url_for("device_edit", device_id=device.id))
            variables = session.scalars(select(Variable).where(Variable.device_id == device.id).order_by(Variable.name)).all()
        return render_template(
            "device_form.html",
            device=device,
            default_poll_interval=device.poll_interval,
            device_variables=variables,
            editing_variable=editing_variable,
        )

    @app.route("/devices/<int:device_id>/variables/<int:variable_id>/delete", methods=["POST"])
    @login_required
    def device_variable_delete(device_id: int, variable_id: int):
        with session_scope() as session:
            variable = session.get(Variable, variable_id)
            if variable is None or variable.device_id != device_id:
                abort(404)
            session.delete(variable)
        flash("Variable eliminada", "success")
        return redirect(url_for("device_edit", device_id=device_id))

    @app.route("/devices/<int:device_id>/delete", methods=["POST"])
    @login_required
    def device_delete(device_id: int):
        with session_scope() as session:
            device = session.get(Device, device_id)
            session.delete(device)
        return redirect(url_for("devices"))

    @app.route("/variables")
    @login_required
    def variables():
        with session_scope() as session:
            rows = session.scalars(select(Variable).options(selectinload(Variable.device)).order_by(Variable.name)).all()
            devices = session.scalars(select(Device).order_by(Device.name)).all()
        return render_template("variables.html", variables=rows, devices=devices)

    @app.route("/variables/new", methods=["GET", "POST"])
    @login_required
    def variable_new():
        with session_scope() as session:
            devices = session.scalars(select(Device).order_by(Device.name)).all()
            selected_device_id = get_optional_int(request.args.get("device_id"))
            if request.method == "POST":
                session.add(build_variable_from_form(request.form))
                return redirect(url_for("variables"))
        return render_template("variable_form.html", variable=None, devices=devices, selected_device_id=selected_device_id)

    @app.route("/variables/<int:variable_id>/edit", methods=["GET", "POST"])
    @login_required
    def variable_edit(variable_id: int):
        with session_scope() as session:
            variable = session.get(Variable, variable_id)
            devices = session.scalars(select(Device).order_by(Device.name)).all()
            if request.method == "POST":
                updated = build_variable_from_form(request.form)
                variable.device_id = updated.device_id
                variable.name = updated.name
                variable.address = updated.address
                variable.function_code = updated.function_code
                variable.data_type = updated.data_type
                variable.register_count = updated.register_count
                variable.scale = updated.scale
                variable.offset = updated.offset
                variable.byte_order = updated.byte_order
                variable.word_order = updated.word_order
                variable.enabled = updated.enabled
                session.add(variable)
                return redirect(url_for("variables"))
        return render_template("variable_form.html", variable=variable, devices=devices)

    @app.route("/variables/<int:variable_id>/delete", methods=["POST"])
    @login_required
    def variable_delete(variable_id: int):
        with session_scope() as session:
            variable = session.get(Variable, variable_id)
            session.delete(variable)
        return redirect(url_for("variables"))

    @app.route("/settings", methods=["GET", "POST"])
    @login_required
    def app_settings():
        with session_scope() as session:
            dashboard_preferences = load_dashboard_preferences(session)
            if request.method == "POST":
                upsert_setting(session, "default_poll_interval", request.form["default_poll_interval"])
                upsert_setting(session, "daemon_reload_interval", request.form["daemon_reload_interval"])
                dashboard_preferences["theme"] = request.form.get("dashboard_theme", dashboard_preferences["theme"])
                dashboard_preferences["mode"] = request.form.get("dashboard_mode", dashboard_preferences["mode"])
                dashboard_preferences["refresh_seconds"] = int(request.form.get("dashboard_refresh_seconds", dashboard_preferences["refresh_seconds"]))
                dashboard_preferences["kiosk_theme"] = request.form.get("kiosk_theme", dashboard_preferences["kiosk_theme"])
                dashboard_preferences["kiosk_mode"] = request.form.get("kiosk_mode", dashboard_preferences["kiosk_mode"])
                chart_variables = []
                for variable_name in variable_inventory(session):
                    chart_variables.append(
                        {
                            "name": variable_name,
                            "enabled": request.form.get(f"chart_enabled__{variable_name}") == "on",
                            "chart_type": request.form.get(f"chart_type__{variable_name}", "line"),
                            "order": int(request.form.get(f"chart_order__{variable_name}", "999")),
                        }
                    )
                dashboard_preferences["chart_variables"] = chart_variables
                upsert_setting(session, "dashboard_preferences", json_dumps(dashboard_preferences))
                if request.form.get("new_password"):
                    user = session.get(User, current_user.id)
                    user.password_hash = hash_password(request.form["new_password"])
                    session.add(user)
                flash("Configuración actualizada", "success")
                return redirect(url_for("app_settings"))
            values = {
                row.key: row.value
                for row in session.scalars(
                    select(Setting).where(Setting.key.in_(["default_poll_interval", "daemon_reload_interval"]))
                ).all()
            }
            chart_variables = dashboard_preferences.get("chart_variables", [])
        return render_template("settings.html", values=values, dashboard_preferences=dashboard_preferences, chart_variables=chart_variables)

    @app.route("/readings")
    @login_required
    def readings():
        page = max(1, int(request.args.get("page", 1)))
        per_page = min(250, max(25, int(request.args.get("per_page", 100))))
        device_id = get_optional_int(request.args.get("device_id"))
        variable_name = request.args.get("variable") or None
        start, end = parse_date_range(request.args.get("start"), request.args.get("end"), default_days=2)
        filters = HistoryFilters(device_id=device_id, variable_name=variable_name, start=start, end=end)

        with session_scope() as session:
            history = history_rows(session, filters, page=page, per_page=per_page)
            devices = device_inventory(session)
            variables = variable_inventory(session)
            daily_summary = energy_aggregate(session, period="daily", device_ids=[device_id] if device_id else None, start=start, end=end, limit=31)

        return render_template(
            "readings.html",
            history=history,
            devices=devices,
            variables=variables,
            filters={
                "device_id": device_id,
                "variable": variable_name,
                "start": start.date().isoformat(),
                "end": (end.date() - timedelta(days=1)).isoformat(),
                "per_page": per_page,
            },
            daily_summary=daily_summary,
        )

    @app.route("/readings/export.csv")
    @login_required
    def readings_export():
        device_id = get_optional_int(request.args.get("device_id"))
        variable_name = request.args.get("variable") or None
        start, end = parse_date_range(request.args.get("start"), request.args.get("end"), default_days=2)
        filters = HistoryFilters(device_id=device_id, variable_name=variable_name, start=start, end=end)

        with session_scope() as session:
            csv_payload = export_history_csv(session, filters)

        response = make_response(csv_payload)
        response.headers["Content-Type"] = "text/csv"
        response.headers["Content-Disposition"] = "attachment; filename=readings.csv"
        return response

    @app.route("/reports/energy.csv")
    @login_required
    def energy_report_export():
        period = request.args.get("period", "daily")
        device_id = get_optional_int(request.args.get("device_id"))
        start, end = parse_date_range(request.args.get("start"), request.args.get("end"), default_days=31)
        with session_scope() as session:
            rows = energy_aggregate(session, period=period, device_ids=[device_id] if device_id else None, start=start, end=end)

        buffer = StringIO()
        buffer.write("period,device,energy_kwh\n")
        for row in rows:
            buffer.write(f"{row['bucket']},{row['device']},{row['energy_kwh']}\n")
        response = make_response(buffer.getvalue())
        response.headers["Content-Type"] = "text/csv"
        response.headers["Content-Disposition"] = f"attachment; filename=energy_{period}.csv"
        return response

    @app.route("/api/realtime")
    @login_required
    def api_realtime():
        device_ids = get_optional_int_list(request.args.getlist("device_id"))
        with session_scope() as session:
            payload = build_dashboard_snapshot(session, device_ids=device_ids)
        return jsonify(payload)

    @app.route("/api/local/realtime")
    def api_local_realtime():
        require_local_request()
        device_ids = get_optional_int_list(request.args.getlist("device_id"))
        with session_scope() as session:
            payload = build_dashboard_snapshot(session, device_ids=device_ids)
        return jsonify(payload)

    @app.route("/api/devices")
    @login_required
    def api_devices():
        with session_scope() as session:
            payload = device_inventory(session)
        return jsonify(payload)

    @app.route("/api/variables")
    @login_required
    def api_variables():
        with session_scope() as session:
            payload = variable_inventory(session)
        return jsonify(payload)

    @app.route("/api/history")
    @login_required
    def api_history():
        page = max(1, int(request.args.get("page", 1)))
        per_page = min(500, max(25, int(request.args.get("per_page", 100))))
        device_id = get_optional_int(request.args.get("device_id"))
        variable_name = request.args.get("variable") or None
        start, end = parse_date_range(request.args.get("start"), request.args.get("end"), default_days=2)
        filters = HistoryFilters(device_id=device_id, variable_name=variable_name, start=start, end=end)

        with session_scope() as session:
            payload = history_rows(session, filters, page=page, per_page=per_page)
        return jsonify(payload)

    @app.route("/api/energy/daily")
    @login_required
    def api_energy_daily():
        device_ids = get_optional_int_list(request.args.getlist("device_id"))
        start, end = parse_date_range(request.args.get("start"), request.args.get("end"), default_days=14)
        with session_scope() as session:
            payload = energy_aggregate(session, period="daily", device_ids=device_ids, start=start, end=end, limit=31)
        return jsonify(payload)

    @app.route("/api/energy/monthly")
    @login_required
    def api_energy_monthly():
        device_ids = get_optional_int_list(request.args.getlist("device_id"))
        start, end = parse_date_range(request.args.get("start"), request.args.get("end"), default_days=365)
        with session_scope() as session:
            payload = energy_aggregate(session, period="monthly", device_ids=device_ids, start=start, end=end, limit=24)
        return jsonify(payload)

    @app.route("/api/energy/total")
    @login_required
    def api_energy_total():
        device_ids = get_optional_int_list(request.args.getlist("device_id"))
        with session_scope() as session:
            payload = total_energy_summary(session, device_ids=device_ids)
        return jsonify(payload)

    return app


def build_variable_from_form(form, forced_device_id: int | None = None) -> Variable:
    return Variable(
        device_id=forced_device_id if forced_device_id is not None else int(form["device_id"]),
        name=form["name"].strip(),
        address=int(form["address"]),
        function_code=form["function_code"],
        data_type=form["data_type"],
        register_count=int(form.get("register_count", 1)),
        scale=float(form.get("scale", 1)),
        offset=float(form.get("offset", 0)),
        byte_order=form.get("byte_order", "big"),
        word_order=form.get("word_order", "big"),
        enabled=("enabled" in form),
    )


def upsert_setting(session, key: str, value: str) -> None:
    row = session.scalar(select(Setting).where(Setting.key == key))
    if row is None:
        row = Setting(key=key, value=value)
    else:
        row.value = value
    session.add(row)


def get_setting_int(key: str, default: int) -> int:
    with session_scope() as session:
        row = session.scalar(select(Setting).where(Setting.key == key))
        if row is None:
            return default
        return int(row.value)


def get_optional_int(value: str | None) -> int | None:
    if not value:
        return None
    return int(value)


def get_optional_int_list(values: list[str]) -> list[int]:
    return [int(value) for value in values if value]


def json_dumps(payload: dict) -> str:
    import json

    return json.dumps(payload)


def format_compact_value(value: float | int | None, decimals: int = 1) -> str:
    if value is None:
        return "-"
    return f"{value:,.{decimals}f}"


def format_compact_metric(value: float | int | None, unit: str, decimals: int = 1) -> tuple[str, str]:
    if value is None:
        return "-", unit
    numeric = float(value)
    if unit == "kWh" and abs(numeric) >= 1000:
        return format_compact_value(numeric / 1000.0, decimals), "MWh"
    if unit == "kW" and abs(numeric) >= 1000:
        return format_compact_value(numeric / 1000.0, decimals), "MW"
    return format_compact_value(numeric, decimals), unit


def require_local_request() -> None:
    remote_addr = request.remote_addr or ""
    if remote_addr not in {"127.0.0.1", "::1"}:
        abort(403)


@login_manager.user_loader
def load_user(user_id: str):
    session = SessionLocal()
    try:
        return session.get(User, int(user_id))
    finally:
        session.close()


app = create_app()


if __name__ == "__main__":
    app.run(host=settings.web_host, port=settings.web_port, debug=False)
