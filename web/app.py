from __future__ import annotations

from datetime import timedelta
from io import StringIO

from flask import Flask, flash, jsonify, make_response, redirect, render_template, request, url_for
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
    build_dashboard_snapshot,
    energy_aggregate,
    export_history_csv,
    history_rows,
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
        return {"now": utcnow()}

    @app.route("/")
    @login_required
    def index():
        selected_device_id = get_optional_int(request.args.get("device_id"))
        with session_scope() as session:
            snapshot = build_dashboard_snapshot(session, device_id=selected_device_id)
            devices = session.scalars(select(Device).order_by(Device.name)).all()
            variables = variable_inventory(session)
        return render_template(
            "dashboard.html",
            snapshot=snapshot,
            devices=devices,
            variables=variables,
            selected_device_id=selected_device_id,
        )

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
            if request.method == "POST":
                device.name = request.form["name"].strip()
                device.ip = request.form["ip"].strip()
                device.port = int(request.form.get("port", 502))
                device.unit_id = int(request.form.get("unit_id", 1))
                device.timeout = float(request.form.get("timeout", 3))
                device.poll_interval = int(request.form.get("poll_interval", 10))
                device.enabled = "enabled" in request.form
                session.add(device)
                return redirect(url_for("devices"))
        return render_template("device_form.html", device=device, default_poll_interval=device.poll_interval)

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
            if request.method == "POST":
                session.add(build_variable_from_form(request.form))
                return redirect(url_for("variables"))
        return render_template("variable_form.html", variable=None, devices=devices)

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
            if request.method == "POST":
                upsert_setting(session, "default_poll_interval", request.form["default_poll_interval"])
                upsert_setting(session, "daemon_reload_interval", request.form["daemon_reload_interval"])
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
        return render_template("settings.html", values=values)

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
            daily_summary = energy_aggregate(session, period="daily", device_id=device_id, start=start, end=end, limit=31)

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
            rows = energy_aggregate(session, period=period, device_id=device_id, start=start, end=end)

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
        device_id = get_optional_int(request.args.get("device_id"))
        with session_scope() as session:
            payload = build_dashboard_snapshot(session, device_id=device_id)
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
        device_id = get_optional_int(request.args.get("device_id"))
        start, end = parse_date_range(request.args.get("start"), request.args.get("end"), default_days=14)
        with session_scope() as session:
            payload = energy_aggregate(session, period="daily", device_id=device_id, start=start, end=end, limit=31)
        return jsonify(payload)

    @app.route("/api/energy/monthly")
    @login_required
    def api_energy_monthly():
        device_id = get_optional_int(request.args.get("device_id"))
        start, end = parse_date_range(request.args.get("start"), request.args.get("end"), default_days=365)
        with session_scope() as session:
            payload = energy_aggregate(session, period="monthly", device_id=device_id, start=start, end=end, limit=24)
        return jsonify(payload)

    @app.route("/api/energy/total")
    @login_required
    def api_energy_total():
        device_id = get_optional_int(request.args.get("device_id"))
        with session_scope() as session:
            payload = total_energy_summary(session, device_id=device_id)
        return jsonify(payload)

    return app


def build_variable_from_form(form) -> Variable:
    return Variable(
        device_id=int(form["device_id"]),
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
