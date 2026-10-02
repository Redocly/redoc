#!/bin/sh
[ -n "$REDOC_URL" ] || exit 0
sed -i "s#https://cdn.jsdelivr.net/npm/redoc@[^/]*/bundles/redoc.standalone.js#${REDOC_URL}#g" \
  /usr/share/nginx/html/*.html
