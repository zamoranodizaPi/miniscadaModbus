from __future__ import annotations

from datetime import datetime, timedelta, timezone
from io import StringIO

from flask import Flask, flash, jsonify, make_response, redirect, render_template, request, url_for
from flask_login import LoginManager, current_user, login_required, login_user, logout_user
from sqlalchemy import desc, func, select
from sqlalchemy.orm import selectinload

from backend.bootstrap import bootstrap_from_config
from backend.config import get_settings
from backend.database import SessionLocal, session_scope
from backend.security import hash_password, verify_password
from models.entities import Device, Reading, Setting, User, Variable


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
        return {"now": datetime.now(timezone.utc)}

    @app.route("/")
    @login_required
    def index():
        with session_scope() as session:
            devices = session.scalars(select(Device).order_by(Device.name)).all()
            latest_rows = session.execute(
                select(
                    Variable.name,
                    Device.name,
                    Reading.value,
                    Reading.timestamp,
                )
                .join(Reading.variable)
                .join(Variable.device)
                .order_by(desc(Reading.timestamp))
                .limit(25)
            ).all()
        return render_template("dashboard.html", devices=devices, latest_rows=latest_rows)

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
                row.key: row.value for row in session.scalars(select(Setting).where(Setting.key.in_(["default_poll_interval", "daemon_reload_interval"]))).all()
            }
        return render_template("settings.html", values=values)

    @app.route("/readings")
    @login_required
    def readings():
        since = datetime.now(timezone.utc) - timedelta(hours=12)
        with session_scope() as session:
            rows = session.execute(
                select(
                    Device.name,
                    Variable.name,
                    Reading.value,
                    Reading.timestamp,
                )
                .join(Reading.variable)
                .join(Variable.device)
                .where(Reading.timestamp >= since)
                .order_by(desc(Reading.timestamp))
                .limit(250)
            ).all()
            trend_rows = session.execute(
                select(Variable.name, func.count(Reading.id), func.max(Reading.timestamp))
                .join(Reading.variable)
                .group_by(Variable.name)
                .order_by(Variable.name)
            ).all()
        return render_template("readings.html", rows=rows, trend_rows=trend_rows)

    @app.route("/readings/export.csv")
    @login_required
    def readings_export():
        since = datetime.now(timezone.utc) - timedelta(days=1)
        with session_scope() as session:
            rows = session.execute(
                select(Device.name, Variable.name, Reading.value, Reading.raw_value, Reading.timestamp)
                .join(Reading.variable)
                .join(Variable.device)
                .where(Reading.timestamp >= since)
                .order_by(desc(Reading.timestamp))
            ).all()

        buffer = StringIO()
        buffer.write("device,variable,value,raw_value,timestamp\n")
        for device_name, variable_name, value, raw_value, timestamp in rows:
            buffer.write(f"{device_name},{variable_name},{value},{raw_value or ''},{timestamp.isoformat()}\n")

        response = make_response(buffer.getvalue())
        response.headers["Content-Type"] = "text/csv"
        response.headers["Content-Disposition"] = "attachment; filename=readings.csv"
        return response

    @app.route("/api/readings/latest")
    @login_required
    def api_readings_latest():
        limit = min(int(request.args.get("limit", 50)), 500)
        with session_scope() as session:
            rows = session.execute(
                select(Device.name, Variable.name, Reading.value, Reading.raw_value, Reading.timestamp)
                .join(Reading.variable)
                .join(Variable.device)
                .order_by(desc(Reading.timestamp))
                .limit(limit)
            ).all()

        payload = [
            {
                "device": device_name,
                "variable": variable_name,
                "value": value,
                "raw_value": raw_value,
                "timestamp": timestamp.isoformat(),
            }
            for device_name, variable_name, value, raw_value, timestamp in rows
        ]
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
