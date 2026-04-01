from __future__ import annotations

from pathlib import Path

import yaml
from sqlalchemy import select

from backend.database import engine, session_scope
from backend.security import hash_password
from models.base import Base
from models.entities import Device, Setting, User, Variable


def init_database() -> None:
    Base.metadata.create_all(bind=engine)


def bootstrap_from_config(config_path: Path) -> None:
    init_database()
    if not config_path.exists():
        ensure_defaults()
        return

    with session_scope() as session:
        if session.scalar(select(User.id).limit(1)) is not None:
            ensure_defaults(session=session)
            return

    with config_path.open("r", encoding="utf-8") as fh:
        payload = yaml.safe_load(fh) or {}

    with session_scope() as session:
        users = payload.get("users", [])
        for user_cfg in users:
            user = User(
                username=user_cfg["username"],
                password_hash=hash_password(user_cfg["password"]),
                is_admin=user_cfg.get("is_admin", True),
            )
            session.add(user)

        devices = payload.get("devices", [])
        for device_cfg in devices:
            device = Device(
                name=device_cfg["name"],
                ip=device_cfg["ip"],
                port=device_cfg.get("port", 502),
                unit_id=device_cfg.get("unit_id", 1),
                timeout=device_cfg.get("timeout", 3.0),
                poll_interval=device_cfg.get("poll_interval", 10),
                enabled=device_cfg.get("enabled", True),
            )
            session.add(device)
            session.flush()

            for variable_cfg in device_cfg.get("variables", []):
                session.add(
                    Variable(
                        device_id=device.id,
                        name=variable_cfg["name"],
                        address=variable_cfg["address"],
                        function_code=variable_cfg["function_code"],
                        data_type=variable_cfg.get("data_type", "uint16"),
                        register_count=variable_cfg.get("register_count", 1),
                        scale=variable_cfg.get("scale", 1.0),
                        offset=variable_cfg.get("offset", 0.0),
                        byte_order=variable_cfg.get("byte_order", "big"),
                        word_order=variable_cfg.get("word_order", "big"),
                        enabled=variable_cfg.get("enabled", True),
                    )
                )

    ensure_defaults()


def ensure_defaults(session=None) -> None:
    managed_session = session is None
    if managed_session:
        ctx = session_scope()
        session = ctx.__enter__()
    try:
        if session.scalar(select(User.id).limit(1)) is None:
            session.add(User(username="admin", password_hash=hash_password("admin"), is_admin=True))
        if session.scalar(select(Setting.id).where(Setting.key == "default_poll_interval")) is None:
            session.add(Setting(key="default_poll_interval", value="10"))
        if session.scalar(select(Setting.id).where(Setting.key == "daemon_reload_interval")) is None:
            session.add(Setting(key="daemon_reload_interval", value="5"))
        if managed_session:
            session.commit()
    finally:
        if managed_session:
            ctx.__exit__(None, None, None)
