#!/bin/sh
set -e

# the asset names carry a content hash chosen at image build time
. /etc/redoc-assets.env
export BUNDLE_FILE STYLES_FILE

# history routing needs the prefix on the app side too; hash routing must not get it
if [ -n "${BASE_PATH}" ] && echo "${REDOC_OPTIONS}" | grep -q 'router=.history.' && ! echo "${REDOC_OPTIONS}" | grep -q 'base-path='; then
  export REDOC_OPTIONS="${REDOC_OPTIONS} base-path=\"/${BASE_PATH}\""
fi

# Loop through all *.tpl.html files and transform them
for tpl in /usr/share/nginx/html/*.tpl.html; do
  target="/usr/share/nginx/html/$(basename "$tpl" .tpl.html).html"
  envsubst < "$tpl" > "$target"
done
