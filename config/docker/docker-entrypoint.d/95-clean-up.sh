#!/bin/sh

# remove template files
rm -f /usr/share/nginx/html/index.prefix.tpl.html /usr/share/nginx/html/index.tpl.html

if [ -n "$BASE_PATH" ]; then
  rm -f /etc/nginx/conf.d/default.conf
  rm -f /usr/share/nginx/html/index.html
  mv /usr/share/nginx/html/index.prefix.html /usr/share/nginx/html/index.html
else
  rm -f /etc/nginx/conf.d/default.prefix.conf
  rm -f /usr/share/nginx/html/index.prefix.html
fi
