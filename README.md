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
- Exportación CSV desde `/readings/export.csv`.
- API JSON autenticada en `/api/readings/latest`.
- Logs JSON para integración con `journald` o colectores externos.
- Dockerfile, `docker-compose.yml` y servicios `systemd`.

## Pendientes razonables para producción

- Agrupar lecturas contiguas para reducir tráfico Modbus.
- CSRF y validación de formularios más estricta.
- API REST más completa.
- Retención/particionado de lecturas.
