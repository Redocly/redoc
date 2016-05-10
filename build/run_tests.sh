#!/bin/bash
if [ "$JOB" = "e2e" ] || [ "$JOB" = "e2e-guru" ]; then
  npm run e2e
else
  npm run unit
fi
