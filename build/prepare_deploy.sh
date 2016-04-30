#!/bin/bash
set -e
set -x
# copy old releases
mkdir -p .ghpages-tmp && cd .ghpages-tmp
# reset local changes before checkout
git reset --hard
git fetch origin gh-pages:gh-pages
git checkout gh-pages
cp -R ../releases/* .
git checkout master
cd -

# build
gulp build
cd demo
cp -R ../dist ./dist
mkdir -p releases
cp -R ../.ghpages-tmp/* ./releases/
cd -
gulp copy-version
