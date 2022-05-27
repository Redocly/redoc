#!/usr/bin/env bash

set -e   # exit on error

# TODO: Update script!

VERSION=$(node scripts/version.js)
VERSION_TAG=v${VERSION:0:1}.x
echo $@
if aws s3 ls "redocly-cdn/redoc/v$VERSION/" "$@"; then
  echo "Version $VERSION already exists"
  exit 1
else
  echo Releasing $VERSION

  echo Uploading to S3 $VERSION
  aws s3 cp bundles "s3://redocly-cdn/redoc/v$VERSION/bundles" --recursive "$@"
  aws s3 cp typings "s3://redocly-cdn/redoc/v$VERSION/typings" --recursive "$@"
  aws s3 cp CHANGELOG.md "s3://redocly-cdn/redoc/v$VERSION/CHANGELOG.md" "$@"
  aws s3 cp LICENSE "s3://redocly-cdn/redoc/v$VERSION/LICENSE" "$@"
  aws s3 cp package.json "s3://redocly-cdn/redoc/v$VERSION/package.json" "$@"
  aws s3 cp README.md "s3://redocly-cdn/redoc/v$VERSION/README.md" "$@"

  echo Uploading to S3 $VERSION_TAG
  aws s3 cp bundles "s3://redocly-cdn/redoc/v$VERSION_TAG/bundles" --recursive "$@"
  aws s3 cp typings "s3://redocly-cdn/redoc/v$VERSION_TAG/typings" --recursive "$@"
  aws s3 cp CHANGELOG.md "s3://redocly-cdn/redoc/v$VERSION_TAG/CHANGELOG.md" "$@"
  aws s3 cp LICENSE "s3://redocly-cdn/redoc/v$VERSION_TAG/LICENSE" "$@"
  aws s3 cp package.json "s3://redocly-cdn/redoc/v$VERSION_TAG/package.json" "$@"
  aws s3 cp README.md "s3://redocly-cdn/redoc/v$VERSION_TAG/README.md" "$@"

  if [[ "$VERSION_TAG" == "v2.x" ]]; then
    echo Uploading to S3 latest
    aws s3 cp bundles "s3://redocly-cdn/redoc/latest/bundles" --recursive "$@"
    aws s3 cp typings "s3://redocly-cdn/redoc/latest/typings" --recursive "$@"
    aws s3 cp CHANGELOG.md "s3://redocly-cdn/redoc/latest/CHANGELOG.md" "$@"
    aws s3 cp LICENSE "s3://redocly-cdn/redoc/latest/LICENSE" "$@"
    aws s3 cp package.json "s3://redocly-cdn/redoc/latest/package.json" "$@"
    aws s3 cp README.md "s3://redocly-cdn/redoc/latest/README.md" "$@"
  fi

  echo
  echo Deployed successfully
  exit 0
fi
