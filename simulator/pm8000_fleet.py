from __future__ import annotations

import logging
import math
import random
import signal
import socketserver
import struct
import threading
import time
from dataclasses import dataclass, field
from typing import Callable

from backend.logging_utils import configure_logging
from simulator.catalog import SIMULATED_METERS, SimulatedMeter


logger = logging.getLogger(__name__)


class ModbusError(Exception):
    def __init__(self, function_code: int, exception_code: int) -> None:
        super().__init__(f"Modbus exception {exception_code} for function {function_code}")
        self.function_code = function_code
        self.exception_code = exception_code


@dataclass(slots=True)
class MeterState:
    definition: SimulatedMeter
    start_time: float = field(default_factory=time.monotonic)
    energy_kwh: float = field(init=False)
    holding_registers: list[int] = field(default_factory=lambda: [0] * 128)
    input_registers: list[int] = field(default_factory=lambda: [0] * 128)
    coils: list[bool] = field(default_factory=lambda: [False] * 16)
    discrete_inputs: list[bool] = field(default_factory=lambda: [False] * 16)
    lock: threading.Lock = field(default_factory=threading.Lock)

    def __post_init__(self) -> None:
        self.energy_kwh = self.definition.energy_offset_kwh
        self.refresh(force=True)

    def refresh(self, force: bool = False) -> None:
        elapsed = max(0.5, time.monotonic() - self.start_time)
        wave = math.sin(elapsed / 11.0)
        ripple = math.cos(elapsed / 7.0)

        kw = max(0.0, self.definition.base_kw * (1.0 + (0.18 * wave)) + random.uniform(-2.5, 2.5))
        voltage = self.definition.base_voltage + (2.8 * ripple) + random.uniform(-0.8, 0.8)
        current = max(0.0, self.definition.base_current * (1.0 + (0.2 * math.sin(elapsed / 9.0))) + random.uniform(-1.0, 1.0))
        frequency = 60.0 + (0.08 * math.sin(elapsed / 13.0))
        pf = min(0.99, max(0.78, 0.91 + (0.05 * math.sin(elapsed / 5.0))))
        demand_kw = kw * 1.07

        if force:
            dt_hours = 0.0
        else:
            dt_hours = 1.0 / 3600.0
        self.energy_kwh += kw * dt_hours

        breaker_closed = kw > (self.definition.base_kw * 0.15)
        alarm = kw > (self.definition.base_kw * 1.2) or voltage < 470.0
        maintenance = self.definition.role == "tablero_reserva" and int(elapsed) % 180 > 145
        energized = breaker_closed and not maintenance

        with self.lock:
            write_float32(self.input_registers, 0, voltage)
            write_float32(self.input_registers, 2, current)
            write_float32(self.input_registers, 4, kw)
            write_float32(self.input_registers, 8, frequency)
            write_float32(self.input_registers, 10, pf)

            write_float32(self.holding_registers, 6, self.energy_kwh)
            write_float32(self.holding_registers, 12, demand_kw)

            self.coils[0] = breaker_closed
            self.coils[1] = alarm
            self.discrete_inputs[0] = maintenance
            self.discrete_inputs[1] = energized


def write_float32(bank: list[int], address: int, value: float) -> None:
    packed = struct.pack(">f", float(value))
    bank[address] = int.from_bytes(packed[0:2], "big", signed=False)
    bank[address + 1] = int.from_bytes(packed[2:4], "big", signed=False)


def pack_bits(values: list[bool]) -> bytes:
    result = bytearray((len(values) + 7) // 8)
    for index, state in enumerate(values):
        if state:
            result[index // 8] |= 1 << (index % 8)
    return bytes(result)


class PM8000RequestHandler(socketserver.BaseRequestHandler):
    server: "PM8000TcpServer"

    def handle(self) -> None:
        while True:
            header = self._recv_exact(7)
            if not header:
                return

            transaction_id, protocol_id, length, unit_id = struct.unpack(">HHHB", header)
            payload = self._recv_exact(length - 1)
            if not payload:
                return

            try:
                response_pdu = self.server.dispatch_request(unit_id, payload)
            except ModbusError as exc:
                function_code = exc.function_code | 0x80
                response_pdu = bytes([function_code, exc.exception_code])

            response = struct.pack(">HHHB", transaction_id, protocol_id, len(response_pdu) + 1, unit_id) + response_pdu
            self.request.sendall(response)

    def _recv_exact(self, size: int) -> bytes | None:
        if size == 0:
            return b""
        data = bytearray()
        while len(data) < size:
            chunk = self.request.recv(size - len(data))
            if not chunk:
                return None
            data.extend(chunk)
        return bytes(data)


class PM8000TcpServer(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True

    def __init__(self, definition: SimulatedMeter):
        self.definition = definition
        self.state = MeterState(definition)
        super().__init__(("0.0.0.0", definition.port), PM8000RequestHandler)

    def dispatch_request(self, unit_id: int, payload: bytes) -> bytes:
        if unit_id != self.definition.unit_id:
            raise ModbusError(payload[0], 0x0B)

        self.state.refresh()
        function_code = payload[0]
        if function_code in {1, 2, 3, 4}:
            if len(payload) != 5:
                raise ModbusError(function_code, 0x03)
            address, count = struct.unpack(">HH", payload[1:5])
            if count <= 0:
                raise ModbusError(function_code, 0x03)
        else:
            raise ModbusError(function_code, 0x01)

        if function_code == 1:
            values = self._slice_bits(self.state.coils, address, count, function_code)
            encoded = pack_bits(values)
            return bytes([function_code, len(encoded)]) + encoded
        if function_code == 2:
            values = self._slice_bits(self.state.discrete_inputs, address, count, function_code)
            encoded = pack_bits(values)
            return bytes([function_code, len(encoded)]) + encoded
        if function_code == 3:
            values = self._slice_registers(self.state.holding_registers, address, count, function_code)
            encoded = b"".join(struct.pack(">H", value) for value in values)
            return bytes([function_code, len(encoded)]) + encoded

        values = self._slice_registers(self.state.input_registers, address, count, function_code)
        encoded = b"".join(struct.pack(">H", value) for value in values)
        return bytes([function_code, len(encoded)]) + encoded

    @staticmethod
    def _slice_bits(bank: list[bool], address: int, count: int, function_code: int) -> list[bool]:
        end = address + count
        if end > len(bank):
            raise ModbusError(function_code, 0x02)
        return bank[address:end]

    @staticmethod
    def _slice_registers(bank: list[int], address: int, count: int, function_code: int) -> list[int]:
        end = address + count
        if end > len(bank):
            raise ModbusError(function_code, 0x02)
        return bank[address:end]


class SimulatorFleet:
    def __init__(self) -> None:
        self.servers = [PM8000TcpServer(definition) for definition in SIMULATED_METERS]
        self.threads: list[threading.Thread] = []
        self.stop_event = threading.Event()

    def start(self) -> None:
        for server in self.servers:
            thread = threading.Thread(target=server.serve_forever, name=f"pm8000-{server.definition.unit_id}", daemon=True)
            thread.start()
            self.threads.append(thread)
            logger.info(
                "Started simulated PM8000 meter",
                extra={"meter": server.definition.name, "port": server.definition.port, "unit_id": server.definition.unit_id},
            )

    def wait(self) -> None:
        while not self.stop_event.is_set():
            time.sleep(1)

    def stop(self) -> None:
        self.stop_event.set()
        for server in self.servers:
            server.shutdown()
            server.server_close()


def main() -> None:
    configure_logging("INFO")
    fleet = SimulatorFleet()

    def stop_handler(signum, frame) -> None:
        logger.info("Stopping PM8000 fleet", extra={"signal": signum})
        fleet.stop()

    signal.signal(signal.SIGINT, stop_handler)
    signal.signal(signal.SIGTERM, stop_handler)
    fleet.start()
    fleet.wait()


if __name__ == "__main__":
    main()
