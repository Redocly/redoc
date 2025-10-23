#!/bin/sh
set -e

# Loop through all *.tpl.html files and transform them
for tpl in /usr/share/nginx/html/*.tpl.html; do
  target="/usr/share/nginx/html/$(basename "$tpl" .tpl.html).html"
  envsubst < "$tpl" > "$target"
done
