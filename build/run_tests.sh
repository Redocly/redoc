#!/bin/bash
if [ "$JOB" = "e2e-guru" ]; then
  npm run e2e
else
  npm run unit
  echo "Starting Basic E2E"
  npm run e2e
fi
