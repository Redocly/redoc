#!/bin/sh
# Redoc 2.x images started with `sh /usr/local/bin/docker-run.sh`; deployments that still pass it
# get the stock nginx entrypoint, which runs docker-entrypoint.d/.
exec /docker-entrypoint.sh nginx -g 'daemon off;'
