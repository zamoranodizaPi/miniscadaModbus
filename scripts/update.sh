#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP_DIR="${MINISCADA_APP_DIR:-/opt/miniscadaModbus}"
APP_USER="${MINISCADA_APP_USER:-pi}"
ENABLE_KIOSK="${MINISCADA_ENABLE_KIOSK:-1}"
WEB_PORT="${MINISCADA_WEB_PORT:-8000}"
SYSTEMD_DIR="/etc/systemd/system"
ENV_FILE="/etc/default/miniscada"

if [[ -f "${ENV_FILE}" ]]; then
  # shellcheck disable=SC1090
  source "${ENV_FILE}"
  WEB_PORT="${MINISCADA_WEB_PORT:-${WEB_PORT}}"
fi

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
  run_as_root chmod +x "${APP_DIR}/scripts/install.sh"
  run_as_root chmod +x "${APP_DIR}/scripts/update.sh"
  run_as_root chmod +x "${APP_DIR}/scripts/start_kiosk.sh"
}

render_service() {
  local template="$1"
  local destination="$2"
  sed \
    -e "s|__APP_DIR__|${APP_DIR}|g" \
    -e "s|__APP_USER__|${APP_USER}|g" \
    -e "s|__WEB_PORT__|${WEB_PORT}|g" \
    "${template}" | run_as_root tee "${destination}" >/dev/null
}

refresh_services() {
  render_service "${APP_DIR}/deploy/miniscada-web.service" "${SYSTEMD_DIR}/miniscada-web.service"
  render_service "${APP_DIR}/deploy/miniscada-daemon.service" "${SYSTEMD_DIR}/miniscada-daemon.service"
  render_service "${APP_DIR}/deploy/miniscada-simulator.service" "${SYSTEMD_DIR}/miniscada-simulator.service"
  if [[ "${ENABLE_KIOSK}" == "1" ]]; then
    render_service "${APP_DIR}/deploy/miniscada-kiosk.service" "${SYSTEMD_DIR}/miniscada-kiosk.service"
  fi
  run_as_root systemctl daemon-reload
}

update_python() {
  if [[ ! -x "${APP_DIR}/.venv/bin/pip" ]]; then
    echo "No existe entorno virtual en ${APP_DIR}/.venv. Ejecuta primero scripts/install.sh" >&2
    exit 1
  fi
  run_as_app "${APP_DIR}/.venv/bin/pip" install -r "${APP_DIR}/requirements.txt"
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
  if [[ "${ENABLE_KIOSK}" == "1" ]] && run_as_root systemctl list-unit-files miniscada-kiosk.service >/dev/null 2>&1; then
    run_as_root systemctl restart miniscada-kiosk.service
  fi
}

main() {
  sync_project
  update_python
  refresh_services
  seed_simulators
  restart_services

  cat <<EOF
Actualizacion completada.

Servicios reiniciados:
- miniscada-simulator.service
- miniscada-daemon.service
- miniscada-web.service
- miniscada-kiosk.service

Verificacion:
sudo systemctl status miniscada-web.service
sudo systemctl status miniscada-daemon.service
sudo systemctl status miniscada-simulator.service
sudo systemctl status miniscada-kiosk.service
EOF
}

main "$@"
