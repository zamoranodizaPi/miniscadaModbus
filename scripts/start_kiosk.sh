#!/usr/bin/env bash
set -euo pipefail

WEB_PORT="${MINISCADA_WEB_PORT:-8000}"
LOCAL_URL="${MINISCADA_LOCAL_DASHBOARD_URL:-http://127.0.0.1:${WEB_PORT}/local}"

find_browser() {
  for candidate in chromium-browser chromium google-chrome; do
    if command -v "${candidate}" >/dev/null 2>&1; then
      echo "${candidate}"
      return 0
    fi
  done
  return 1
}

BROWSER="$(find_browser)" || {
  echo "No se encontro navegador compatible para kiosk" >&2
  exit 1
}

xset -dpms
xset s off
xset s noblank

if command -v unclutter >/dev/null 2>&1; then
  unclutter -idle 0.5 -root &
fi

if command -v openbox-session >/dev/null 2>&1; then
  openbox-session &
fi

exec "${BROWSER}" \
  --noerrdialogs \
  --disable-infobars \
  --disable-session-crashed-bubble \
  --disable-component-update \
  --check-for-update-interval=31536000 \
  --simulate-outdated-no-au="Tue, 31 Dec 2099 23:59:59 GMT" \
  --disable-features=Translate,MediaRouter,OptimizationHints,AutofillServerCommunication \
  --overscroll-history-navigation=0 \
  --disable-pinch \
  --window-position=0,0 \
  --window-size=1024,600 \
  --kiosk \
  --app="${LOCAL_URL}"
