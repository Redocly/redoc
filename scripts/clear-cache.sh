#!/usr/bin/env bash

set -e                                      # exit on error

echo Clearing cache
curl -i -X POST https://purge.jsdelivr.net/ \
 -H 'cache-control: no-cache' \
 -H 'content-type: application/json' \
 -d '{
      "path": [
        "npm/redoc@latest/bundles/redoc.browser.lib.js",
        "npm/redoc@latest/bundles/redoc.lib.js",
        "npm/redoc@latest/bundles/redoc.standalone.js"
      ]
    }'

echo
echo Cache cleared successfully

exit 0