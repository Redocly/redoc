#!/bin/bash
if [ $JOB = "e2e" ]; then
  npm run e2e
else
  npm run unit
fi
