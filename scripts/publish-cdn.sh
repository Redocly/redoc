#!/usr/bin/env bash

set -e # exit on error

cd "$(dirname "$0")/.."

VERSION=$(node scripts/version.js)
MAJOR_TAG=v${VERSION%%.*}.x

copy_to_s3() {
  aws s3 cp --exclude "*" --include "*.js" --content-type "application/javascript; charset=utf-8" bundles "s3://redocly-cdn/redoc/$1/bundles" --recursive
  aws s3 cp --exclude "*" --include "*.map" --content-type "application/json" bundles "s3://redocly-cdn/redoc/$1/bundles" --recursive
  aws s3 cp CHANGELOG.md "s3://redocly-cdn/redoc/$1/CHANGELOG.md"
  aws s3 cp LICENSE "s3://redocly-cdn/redoc/$1/LICENSE"
  aws s3 cp package.json "s3://redocly-cdn/redoc/$1/package.json"
  aws s3 cp README.md "s3://redocly-cdn/redoc/$1/README.md"
}

if aws s3 ls "redocly-cdn/redoc/v$VERSION/"; then
  echo "Version $VERSION already exists"
  exit 1
fi

echo "Releasing $VERSION"

echo "Uploading to S3 v$VERSION"
copy_to_s3 "v$VERSION"

# Moving tags (vN.x, latest) advance on stable releases only;
# a prerelease publishes just its exact-version path.
if [[ "$VERSION" == *-* ]]; then
  echo "Prerelease: skipping $MAJOR_TAG and latest"
else
  echo "Uploading to S3 $MAJOR_TAG"
  copy_to_s3 "$MAJOR_TAG"

  echo "Uploading to S3 latest"
  copy_to_s3 latest
fi

echo
echo "Deployed successfully"
