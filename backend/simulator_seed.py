from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import selectinload

from backend.bootstrap import init_database
from backend.database import session_scope
from models.entities import Device, Variable
from simulator.catalog import PM8000_VARIABLES, SIMULATED_METERS


def seed_pm8000_simulators() -> None:
    init_database()
    with session_scope() as session:
        existing_devices = {
            device.name: device
            for device in session.scalars(select(Device).options(selectinload(Device.variables))).all()
        }

        for meter in SIMULATED_METERS:
            device = existing_devices.get(meter.name)
            if device is None:
                device = Device(
                    name=meter.name,
                    ip="127.0.0.1",
                    port=meter.port,
                    unit_id=meter.unit_id,
                    timeout=2.0,
                    poll_interval=5,
                    enabled=True,
                )
                session.add(device)
                session.flush()
            else:
                device.ip = "127.0.0.1"
                device.port = meter.port
                device.unit_id = meter.unit_id
                device.timeout = 2.0
                device.poll_interval = 5
                device.enabled = True
                session.add(device)

            existing_variables = {item.name: item for item in device.variables}
            for template in PM8000_VARIABLES:
                variable = existing_variables.get(template.name)
                if variable is None:
                    variable = Variable(
                        device_id=device.id,
                        name=template.name,
                        address=template.address,
                        function_code=template.function_code,
                        data_type=template.data_type,
                        register_count=template.register_count,
                        scale=template.scale,
                        offset=template.offset,
                        byte_order=template.byte_order,
                        word_order=template.word_order,
                        enabled=True,
                    )
                else:
                    variable.address = template.address
                    variable.function_code = template.function_code
                    variable.data_type = template.data_type
                    variable.register_count = template.register_count
                    variable.scale = template.scale
                    variable.offset = template.offset
                    variable.byte_order = template.byte_order
                    variable.word_order = template.word_order
                    variable.enabled = True
                session.add(variable)


def main() -> None:
    seed_pm8000_simulators()


if __name__ == "__main__":
    main()
