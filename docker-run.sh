#! /bin/sh

set -e

if [ -n "$API_TITLE" ]; then
  sed -i "s|%API_TITLE%|$API_TITLE|g" /usr/share/nginx/html/index.html
fi

if [ -n "$API_FAVICON" ]; then
  sed -i "s|%API_FAVICON%|<link rel=\"icon\" href=\"$API_FAVICON\">|g" /usr/share/nginx/html/index.html
else
  sed -i "|%API_FAVICON%|d" /usr/share/nginx/html/index.html
fi

if [ -n "$API_URL" ]; then
  sed -i "s|%API_URL%|$API_URL|g" /usr/share/nginx/html/index.html
fi

if [ -n "$PORT" ]; then
  sed -i "s|8080|${PORT}|g" /etc/nginx/nginx.conf
fi

exec nginx -g 'daemon off;'
