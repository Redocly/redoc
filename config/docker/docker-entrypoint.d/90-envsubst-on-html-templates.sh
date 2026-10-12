#!/bin/sh
set -e

# the asset names carry a content hash chosen at image build time
. /etc/redoc-assets.env
export BUNDLE_FILE STYLES_FILE

html_escape() {
  printf '%s' "$1" | sed -e 's/&/\&amp;/g' -e 's/</\&lt;/g' -e 's/>/\&gt;/g' -e 's/"/\&quot;/g'
}

# `/…`, `//…` and `scheme:…`; a colon in a query (`a.yaml?from=https://…`) stays relative
is_absolute_url() {
  case "$1" in /*) return 0 ;; *:*) ;; *) return 1 ;; esac
  case "${1%%:*}" in [!A-Za-z]* | *[!A-Za-z0-9+.-]*) return 1 ;; esac
}

HISTORY_ROUTER=
echo "${REDOC_OPTIONS}" | grep -qE "router[[:space:]]*=[[:space:]]*[\"']?history" && HISTORY_ROUTER=1

# history routing needs the prefix on the app side too; hash routing must not get it
if [ -n "${BASE_PATH}" ] && [ -n "${HISTORY_ROUTER}" ] && ! echo "${REDOC_OPTIONS}" | grep -qE 'base-path[[:space:]]*='; then
  export REDOC_OPTIONS="${REDOC_OPTIONS} base-path=\"/$(html_escape "${BASE_PATH}")\""
fi

# without BASE_PATH the asset URLs stay relative, as in the Redoc 2.x image, so the page also works
# behind a proxy that strips a prefix; history routing renders the page at deep paths and needs "/"
if [ -n "${BASE_PATH}" ]; then
  ASSET_BASE="/${BASE_PATH}/"
elif [ -n "${HISTORY_ROUTER}" ]; then
  ASSET_BASE=/
else
  ASSET_BASE=
fi

# absolute URLs are used as given, file names resolve next to the page assets
if is_absolute_url "${PAGE_FAVICON}"; then
  FAVICON_HREF="${PAGE_FAVICON}"
else
  FAVICON_HREF="${ASSET_BASE}${PAGE_FAVICON}"
fi

# a relative spec file sits next to the page assets, not under the deep route the page is opened at;
# a 2.x value that already starts with BASE_PATH must not get it twice
if ! is_absolute_url "${SPEC_URL}"; then
  case "${SPEC_URL}" in
    "${BASE_PATH}"/*) SPEC_URL="/${SPEC_URL}" ;;
    *) SPEC_URL="${ASSET_BASE}${SPEC_URL}" ;;
  esac
fi

# REDOC_OPTIONS stays raw: it is attribute markup by design
export ASSET_BASE="$(html_escape "${ASSET_BASE}")"
export FAVICON_HREF="$(html_escape "${FAVICON_HREF}")"
export PAGE_TITLE="$(html_escape "${PAGE_TITLE}")"
export SPEC_URL="$(html_escape "${SPEC_URL}")"

# a page mounted over index.html is the user's own; writing through the mount would overwrite it
if grep -q ' /tmp/redoc/index.html ' /proc/self/mountinfo 2>/dev/null; then
  echo "redoc: index.html is mounted, serving it as is" >&2
  exit 0
fi

envsubst '${PAGE_TITLE} ${FAVICON_HREF} ${ASSET_BASE} ${STYLES_FILE} ${BUNDLE_FILE} ${SPEC_URL} ${REDOC_OPTIONS}' \
  < /etc/redoc/index.tpl.html > /tmp/redoc/index.html.tmp
mv -f /tmp/redoc/index.html.tmp /tmp/redoc/index.html
