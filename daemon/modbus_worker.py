from __future__ import annotations

import logging
import struct
from datetime import datetime, timezone

from pymodbus.client import ModbusTcpClient

from models.entities import Device, Reading, Variable


logger = logging.getLogger(__name__)


REGISTER_READERS = {
    "coil": "read_coils",
    "discrete_input": "read_discrete_inputs",
    "holding_register": "read_holding_registers",
    "input_register": "read_input_registers",
}


class ModbusReader:
    def poll_device(self, session, device: Device) -> None:
        variables = [item for item in device.variables if item.enabled]
        if not variables:
            return

        client = ModbusTcpClient(host=device.ip, port=device.port, timeout=device.timeout)
        try:
            if not client.connect():
                self._set_error(device, "Unable to connect")
                session.add(device)
                return

            for variable in variables:
                try:
                    value, raw_value = self.read_variable(client, device, variable)
                    session.add(Reading(variable_id=variable.id, value=value, raw_value=raw_value))
                    device.last_error = None
                    device.last_seen_at = datetime.now(timezone.utc)
                except Exception as exc:
                    logger.exception("Read failed for variable %s", variable.name)
                    self._set_error(device, str(exc))
        finally:
            client.close()
            session.add(device)

    def read_variable(self, client: ModbusTcpClient, device: Device, variable: Variable) -> tuple[float, str]:
        function_name = REGISTER_READERS[variable.function_code]
        read_fn = getattr(client, function_name)

        if variable.function_code in {"coil", "discrete_input"}:
            response = read_fn(address=variable.address, count=1, device_id=device.unit_id)
            if response.isError():
                raise RuntimeError(str(response))
            raw = bool(response.bits[0])
            value = float(raw)
            scaled = (value * variable.scale) + variable.offset
            return scaled, str(raw)

        response = read_fn(address=variable.address, count=variable.register_count, device_id=device.unit_id)
        if response.isError():
            raise RuntimeError(str(response))

        registers = response.registers
        value = decode_registers(registers, variable.data_type, variable.byte_order, variable.word_order)
        scaled = (float(value) * variable.scale) + variable.offset
        return scaled, ",".join(str(item) for item in registers)

    @staticmethod
    def _set_error(device: Device, message: str) -> None:
        device.last_error = message


def decode_registers(registers: list[int], data_type: str, byte_order: str, word_order: str):
    if data_type in {"int16", "uint16"}:
        value = registers[0]
        if data_type == "int16" and value >= 0x8000:
            value -= 0x10000
        return value

    ordered = list(registers)
    if word_order == "little":
        ordered.reverse()

    raw = b"".join(item.to_bytes(2, byteorder=byte_order, signed=False) for item in ordered)

    fmt_map = {
        "int32": "i",
        "uint32": "I",
        "float32": "f",
        "int64": "q",
        "uint64": "Q",
        "float64": "d",
    }
    if data_type not in fmt_map:
        raise ValueError(f"Unsupported data type: {data_type}")

    prefix = ">" if byte_order == "big" else "<"
    size = struct.calcsize(fmt_map[data_type])
    if len(raw) != size:
        raise ValueError(f"Expected {size} bytes for {data_type}, got {len(raw)}")
    return struct.unpack(prefix + fmt_map[data_type], raw)[0]
