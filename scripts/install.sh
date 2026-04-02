#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP_DIR="${MINISCADA_APP_DIR:-/opt/miniscadaModbus}"
APP_USER="${MINISCADA_APP_USER:-pi}"
WEB_PORT="${MINISCADA_WEB_PORT:-8000}"
SECRET_KEY="${MINISCADA_SECRET_KEY:-change-me}"
ENABLE_KIOSK="${MINISCADA_ENABLE_KIOSK:-1}"
SYSTEMD_DIR="/etc/systemd/system"
ENV_FILE="/etc/default/miniscada"

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "Falta el comando requerido: $1" >&2
    exit 1
  }
}

run_as_root() {
  if [[ "${EUID}" -eq 0 ]]; then
    "$@"
  else
    sudo "$@"
  fi
}

run_as_app() {
  if [[ "${EUID}" -eq 0 ]]; then
    runuser -u "${APP_USER}" -- "$@"
  else
    sudo -u "${APP_USER}" "$@"
  fi
}

install_packages() {
  local browser_pkg="chromium-browser"
  if ! apt-cache show chromium-browser >/dev/null 2>&1; then
    browser_pkg="chromium"
  fi
  run_as_root apt-get update
  run_as_root apt-get install -y python3 python3-venv python3-pip python3-full rsync xserver-xorg xinit x11-xserver-utils openbox unclutter "${browser_pkg}"
}

sync_project() {
  run_as_root mkdir -p "${APP_DIR}"
  run_as_root rsync -a \
    --delete \
    --exclude ".git" \
    --exclude ".venv" \
    --exclude "__pycache__" \
    --exclude "*.pyc" \
    --exclude "instance/*.db" \
    "${ROOT_DIR}/" "${APP_DIR}/"
  run_as_root chown -R "${APP_USER}:${APP_USER}" "${APP_DIR}"
}

create_env() {
  run_as_root mkdir -p "$(dirname "${ENV_FILE}")"
  run_as_root tee "${ENV_FILE}" >/dev/null <<EOF
MINISCADA_SECRET_KEY=${SECRET_KEY}
MINISCADA_WEB_HOST=0.0.0.0
MINISCADA_WEB_PORT=${WEB_PORT}
MINISCADA_DATABASE_URL=sqlite:///${APP_DIR}/instance/miniscada.db
MINISCADA_CONFIG_PATH=${APP_DIR}/config/initial_config.yaml
MINISCADA_LOG_LEVEL=INFO
MINISCADA_LOCAL_DASHBOARD_URL=http://127.0.0.1:${WEB_PORT}/local
EOF
}

setup_python() {
  run_as_app python3 -m venv "${APP_DIR}/.venv"
  run_as_app "${APP_DIR}/.venv/bin/pip" install --upgrade pip
  run_as_app "${APP_DIR}/.venv/bin/pip" install -r "${APP_DIR}/requirements.txt"
}

render_service() {
  local template="$1"
  local destination="$2"
  run_as_root sed \
    -e "s|__APP_DIR__|${APP_DIR}|g" \
    -e "s|__APP_USER__|${APP_USER}|g" \
    -e "s|__WEB_PORT__|${WEB_PORT}|g" \
    "${template}" > "${destination}"
}

install_services() {
  render_service "${APP_DIR}/deploy/miniscada-web.service" "${SYSTEMD_DIR}/miniscada-web.service"
  render_service "${APP_DIR}/deploy/miniscada-daemon.service" "${SYSTEMD_DIR}/miniscada-daemon.service"
  render_service "${APP_DIR}/deploy/miniscada-simulator.service" "${SYSTEMD_DIR}/miniscada-simulator.service"
  if [[ "${ENABLE_KIOSK}" == "1" ]]; then
    render_service "${APP_DIR}/deploy/miniscada-kiosk.service" "${SYSTEMD_DIR}/miniscada-kiosk.service"
  fi
  run_as_root systemctl daemon-reload
  run_as_root systemctl enable miniscada-simulator.service
  run_as_root systemctl enable miniscada-daemon.service
  run_as_root systemctl enable miniscada-web.service
  if [[ "${ENABLE_KIOSK}" == "1" ]]; then
    run_as_root systemctl enable miniscada-kiosk.service
    run_as_root systemctl set-default graphical.target
  fi
}

seed_simulators() {
  if [[ "${EUID}" -eq 0 ]]; then
    runuser -u "${APP_USER}" -- bash -lc "cd '${APP_DIR}' && .venv/bin/python -m backend.simulator_seed"
  else
    sudo -u "${APP_USER}" bash -lc "cd '${APP_DIR}' && .venv/bin/python -m backend.simulator_seed"
  fi
}

restart_services() {
  run_as_root systemctl restart miniscada-simulator.service
  sleep 2
  run_as_root systemctl restart miniscada-daemon.service
  run_as_root systemctl restart miniscada-web.service
  if [[ "${ENABLE_KIOSK}" == "1" ]]; then
    run_as_root systemctl restart miniscada-kiosk.service
  fi
}

show_status() {
  run_as_root systemctl --no-pager --full status miniscada-simulator.service || true
  run_as_root systemctl --no-pager --full status miniscada-daemon.service || true
  run_as_root systemctl --no-pager --full status miniscada-web.service || true
  if [[ "${ENABLE_KIOSK}" == "1" ]]; then
    run_as_root systemctl --no-pager --full status miniscada-kiosk.service || true
  fi
}

main() {
  require_cmd python3
  require_cmd sed
  install_packages
  sync_project
  run_as_root mkdir -p "${APP_DIR}/instance"
  run_as_root chown -R "${APP_USER}:${APP_USER}" "${APP_DIR}/instance"
  create_env
  setup_python
  install_services
  seed_simulators
  restart_services

  cat <<EOF
Instalacion completada.

Ruta de despliegue: ${APP_DIR}
Usuario de servicio: ${APP_USER}
Puerto web: ${WEB_PORT}

Servicios habilitados:
- miniscada-web.service
- miniscada-daemon.service
- miniscada-simulator.service
- miniscada-kiosk.service

Verificacion rapida:
sudo systemctl status miniscada-web.service
sudo systemctl status miniscada-daemon.service
sudo systemctl status miniscada-simulator.service
sudo systemctl status miniscada-kiosk.service

Logs:
journalctl -u miniscada-web.service -f
journalctl -u miniscada-daemon.service -f
journalctl -u miniscada-simulator.service -f
journalctl -u miniscada-kiosk.service -f
EOF

  show_status
}

main "$@"
