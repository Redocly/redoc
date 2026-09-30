#!/usr/bin/env bash

set -e # exit on error

cd "$(dirname "$0")/.."

VERSION=$(node scripts/version.js)
MAJOR=${VERSION%%.*}

# jsDelivr caches exact-version URLs immutably; only dist-tag and
# semver-range URLs move on a release and need purging.
if [[ "$VERSION" == *-* ]]; then
  TAGS=("rc" "next")
else
  TAGS=("latest" "$MAJOR")
fi

PATHS=""
for tag in "${TAGS[@]}"; do
  for file in "redoc.js" "redoc.standalone.js"; do
    PATHS+="${PATHS:+,}\"/npm/redoc@$tag/bundles/$file\""
  done
done

echo "jsdelivr clearing cache (${TAGS[*]})"
curl -i -X POST https://purge.jsdelivr.net/ \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -d "{\"path\":[$PATHS]}"

echo
echo start invalidate cloudfront

aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION" --paths "/redoc/*"

echo Cache cleared successfully

exit 0
