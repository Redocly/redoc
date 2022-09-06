#!/usr/bin/env bash

set -e   # exit on error

# TODO: Update script!

VERSION=$(node scripts/version.js)
VERSION_TAG=v${VERSION:0:1}.x

copy_to_s3 () {
  aws s3 cp --exclude "*" --include "*.js" --content-type "application/javascript; charset=utf-8" bundles "s3://redocly-cdn/redoc/$1/bundles" --recursive
  aws s3 cp --exclude "*" --include "*.map" --content-type "application/json" bundles "s3://redocly-cdn/redoc/$1/bundles" --recursive
  aws s3 cp --exclude "*" --include "*.txt" bundles "s3://redocly-cdn/redoc/$1/bundles" --recursive
  aws s3 cp CHANGELOG.md "s3://redocly-cdn/redoc/$1/CHANGELOG.md"
  aws s3 cp LICENSE "s3://redocly-cdn/redoc/$1/LICENSE"
  aws s3 cp package.json "s3://redocly-cdn/redoc/$1/package.json"
  aws s3 cp README.md "s3://redocly-cdn/redoc/$1/README.md"
}

if aws s3 ls "redocly-cdn/redoc/v$VERSION/" "$@"; then
  echo "Version $VERSION already exists"
  exit 1
else
  echo Releasing $VERSION

  echo Uploading to S3 $VERSION
  copy_to_s3 "v$VERSION"

  echo Uploading to S3 $VERSION_TAG
  copy_to_s3 "$VERSION_TAG" $@

  if [[ "$VERSION_TAG" == "v2.x" ]]; then
    echo Uploading to S3 latest
    copy_to_s3 latest $@
  fi

  echo
  echo Deployed successfully
  exit 0
fi
