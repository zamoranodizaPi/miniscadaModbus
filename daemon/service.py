from __future__ import annotations

import logging
import time
from collections import defaultdict
from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import selectinload

from backend.bootstrap import bootstrap_from_config
from backend.config import get_settings
from backend.database import session_scope
from backend.logging_utils import configure_logging
from daemon.modbus_worker import ModbusReader
from models.entities import Device, Setting


logger = logging.getLogger(__name__)


class PollingDaemon:
    def __init__(self) -> None:
        self.settings = get_settings()
        self.reader = ModbusReader()
        self.last_polled: dict[int, datetime] = defaultdict(lambda: datetime.fromtimestamp(0, tz=timezone.utc))

    def run_forever(self) -> None:
        configure_logging(self.settings.log_level)
        bootstrap_from_config(self.settings.config_path)
        logger.info("Mini SCADA daemon started")

        while True:
            started_at = time.monotonic()
            try:
                self.run_once()
            except Exception:
                logger.exception("Unexpected daemon error")

            refresh_interval = self.get_reload_interval()
            elapsed = time.monotonic() - started_at
            time.sleep(max(1, refresh_interval - elapsed))

    def run_once(self) -> None:
        now = datetime.now(timezone.utc)
        with session_scope() as session:
            devices = session.scalars(
                select(Device).options(selectinload(Device.variables)).where(Device.enabled.is_(True))
            ).all()

            for device in devices:
                last = self.last_polled[device.id]
                if (now - last).total_seconds() < device.poll_interval:
                    continue
                logger.info("Polling device %s", device.name)
                self.reader.poll_device(session, device)
                self.last_polled[device.id] = now

    def get_reload_interval(self) -> int:
        with session_scope() as session:
            setting = session.scalar(select(Setting).where(Setting.key == "daemon_reload_interval"))
            if setting:
                return max(1, int(setting.value))
        return self.settings.daemon_refresh_seconds


def main() -> None:
    PollingDaemon().run_forever()


if __name__ == "__main__":
    main()
