#!/bin/bash
set -e
set -x
mkdir -p .ghpages-tmp && cd .ghpages-tmp
git checkout gh-pages
cp -R ../releases/* .
git checkout master
cd -
gulp build
cd demo
cp -R ../dist ./dist
mkdir -p releases
cp -R ../.ghpages-tmp/* ./releases/
cd -
gulp copy-version
