#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

python3 -m venv "$ROOT_DIR/.venv"
"$ROOT_DIR/.venv/bin/pip" install --upgrade pip
"$ROOT_DIR/.venv/bin/pip" install -r "$ROOT_DIR/requirements.txt"

mkdir -p "$ROOT_DIR/instance"

cat <<EOF
Instalación completada.
1. Activar entorno: source $ROOT_DIR/.venv/bin/activate
2. Iniciar web: python -m web.app
3. Iniciar daemon: python -m daemon.service
EOF
