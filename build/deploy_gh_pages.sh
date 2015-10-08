#!/bin/bash
set -o pipefail
(
  set -e
  set -x
  cd demo
  git init
  git config user.name "Travis-CI"
  git config user.email "travis@travis"
  cp -r ../dist ./dist
  git add .
  git commit -m "Deployed to Github Pages"
  git push --force "https://${GH_TOKEN}@${GH_REF}" master:gh-pages 2>&1
) 2>&1 | sed "s/${GH_TOKEN}/xxPASSxx/"
