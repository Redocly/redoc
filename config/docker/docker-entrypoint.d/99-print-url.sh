#!/bin/sh

port_note=""
[ "${PORT}" = "80" ] && port_note=" (default)"
spec_note=""
[ "${SPEC_URL}" = "https://cdn.redocly.com/redoc/museum-api.yaml" ] && spec_note=" (default sample)"

(
  sleep 1
  echo ""
  echo "  Container port: ${PORT}${port_note}, path: /${BASE_PATH}"
  echo "  Open http://${HOST}:<host port mapped with -p>/${BASE_PATH}"
  echo "  API definition: ${SPEC_URL}${spec_note}"
  echo ""
) &
