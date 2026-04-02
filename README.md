# Mini SCADA Modbus TCP

Proyecto base para Raspberry Pi que actúa como datalogger Modbus TCP con almacenamiento en SQLite, daemon de poleo y una interfaz web para configuración y monitoreo.

## Estructura

- `backend/`: configuración, base de datos, seguridad y bootstrap.
- `daemon/`: servicio de poleo Modbus TCP.
- `web/`: aplicación Flask, plantillas y archivos estáticos.
- `models/`: modelos SQLAlchemy.
- `config/`: configuración inicial YAML.
- `deploy/`: servicios `systemd`.
- `scripts/`: instalación inicial.
- `simulator/`: flota local de medidores PM8000 simulados.

## Requisitos

- Python 3.11+
- Acceso a dispositivos Modbus TCP en red local

## Instalación rápida

```bash
./scripts/install.sh
source .venv/bin/activate
```

## Ejecución

Web:

```bash
python -m web.app
```

Daemon:

```bash
python -m daemon.service
```

Simulador PM8000:

```bash
python -m backend.simulator_seed
python -m simulator.pm8000_fleet
```

## Dashboard Empresarial

La web principal ahora expone un dashboard energético con:

- KPIs de potencia, energía, voltaje y corriente promedio.
- Tendencia de potencia en tiempo real con refresco automático.
- Distribución energética por dispositivo.
- Históricos filtrables por dispositivo, variable y rango de fechas.
- Exportación CSV de históricos y reportes energéticos diarios/mensuales.

## API REST autenticada

Endpoints disponibles bajo sesión iniciada:

- `GET /api/realtime`
- `GET /api/devices`
- `GET /api/variables`
- `GET /api/history`
- `GET /api/energy/daily`
- `GET /api/energy/monthly`
- `GET /api/energy/total`

La primera ejecución crea `instance/miniscada.db` y carga `config/initial_config.yaml`.

Credenciales iniciales:

- Usuario: `admin`
- Contraseña: `admin`

## Configuración

Variables relevantes por entorno:

- `MINISCADA_SECRET_KEY`
- `MINISCADA_DATABASE_URL`
- `MINISCADA_CONFIG_PATH`
- `MINISCADA_WEB_HOST`
- `MINISCADA_WEB_PORT`
- `MINISCADA_LOG_LEVEL`

## Características incluidas

- CRUD de dispositivos y variables.
- Autenticación con contraseñas hasheadas con `bcrypt`.
- Polling continuo a múltiples equipos Modbus TCP.
- Decodificación básica de `coil`, `discrete_input`, `holding_register` e `input_register`.
- Registro de lecturas históricas.
- Dashboard web tipo empresarial con Chart.js y actualización automática.
- Exportación CSV desde `/readings/export.csv` y `/reports/energy.csv`.
- API JSON autenticada para tiempo real, históricos y métricas energéticas.
- Simulador local de 8 medidores PowerLogic PM8000 en `127.0.0.1:15020-15027`.
- Logs JSON para integración con `journald` o colectores externos.
- Dockerfile, `docker-compose.yml` y servicios `systemd`.

## Pendientes razonables para producción

- Agrupar lecturas contiguas para reducir tráfico Modbus.
- CSRF y validación de formularios más estricta.
- API REST más completa.
- Retención/particionado de lecturas.
