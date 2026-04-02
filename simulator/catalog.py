from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True, slots=True)
class VariableTemplate:
    name: str
    address: int
    function_code: str
    data_type: str
    register_count: int
    scale: float = 1.0
    offset: float = 0.0
    byte_order: str = "big"
    word_order: str = "big"


@dataclass(frozen=True, slots=True)
class SimulatedMeter:
    name: str
    role: str
    unit_id: int
    port: int
    base_kw: float
    base_voltage: float
    base_current: float
    energy_offset_kwh: float


PM8000_VARIABLES = [
    VariableTemplate("voltaje_ll_v", 0, "input_register", "float32", 2),
    VariableTemplate("corriente_total_a", 2, "input_register", "float32", 2),
    VariableTemplate("potencia_activa_kw", 4, "input_register", "float32", 2),
    VariableTemplate("energia_acumulada_kwh", 6, "holding_register", "float32", 2),
    VariableTemplate("frecuencia_hz", 8, "input_register", "float32", 2),
    VariableTemplate("factor_potencia", 10, "input_register", "float32", 2),
    VariableTemplate("demanda_kw", 12, "holding_register", "float32", 2),
    VariableTemplate("estado_interruptor", 0, "coil", "uint16", 1),
    VariableTemplate("alarma_general", 1, "coil", "uint16", 1),
    VariableTemplate("mantenimiento_activo", 0, "discrete_input", "uint16", 1),
    VariableTemplate("tablero_energizado", 1, "discrete_input", "uint16", 1),
]


SIMULATED_METERS = [
    SimulatedMeter("pm8000-subestacion", "alimentador_principal", 1, 15020, 480.0, 480.0, 620.0, 125000.0),
    SimulatedMeter("pm8000-horno", "horno", 2, 15021, 180.0, 478.0, 260.0, 48200.0),
    SimulatedMeter("pm8000-motores-molienda", "motores", 3, 15022, 96.0, 479.0, 142.0, 22100.0),
    SimulatedMeter("pm8000-servicios-propios", "servicios_propios", 4, 15023, 42.0, 481.0, 61.0, 15400.0),
    SimulatedMeter("pm8000-bombas-proceso", "bombas", 5, 15024, 88.0, 477.5, 135.0, 28150.0),
    SimulatedMeter("pm8000-compresores", "compresores", 6, 15025, 73.0, 479.5, 109.0, 19980.0),
    SimulatedMeter("pm8000-iluminacion", "iluminacion", 7, 15026, 18.0, 482.0, 28.0, 9100.0),
    SimulatedMeter("pm8000-reserva", "tablero_reserva", 8, 15027, 24.0, 480.5, 34.0, 11650.0),
]
