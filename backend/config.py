from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent
DEFAULT_INSTANCE_DIR = BASE_DIR / "instance"
DEFAULT_DB_PATH = DEFAULT_INSTANCE_DIR / "miniscada.db"
DEFAULT_CONFIG_PATH = BASE_DIR / "config" / "initial_config.yaml"


@dataclass(slots=True)
class Settings:
    secret_key: str = os.getenv("MINISCADA_SECRET_KEY", "change-me")
    database_url: str = os.getenv("MINISCADA_DATABASE_URL", f"sqlite:///{DEFAULT_DB_PATH}")
    config_path: Path = Path(os.getenv("MINISCADA_CONFIG_PATH", DEFAULT_CONFIG_PATH))
    log_level: str = os.getenv("MINISCADA_LOG_LEVEL", "INFO")
    web_host: str = os.getenv("MINISCADA_WEB_HOST", "0.0.0.0")
    web_port: int = int(os.getenv("MINISCADA_WEB_PORT", "8000"))
    daemon_refresh_seconds: int = int(os.getenv("MINISCADA_DAEMON_REFRESH_SECONDS", "5"))


def get_settings() -> Settings:
    DEFAULT_INSTANCE_DIR.mkdir(parents=True, exist_ok=True)
    return Settings()
