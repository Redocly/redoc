#!/usr/bin/env node
'use strict';
require('shelljs/global');

var paths = require('./paths');
var path = require('path');

// copy old releases
mkdir('-p', '.ghpages-tmp');
cd('.ghpages-tmp');

// reset local changes before checkout
exec('git reset --hard');
exec('git fetch origin gh-pages:gh-pages');
exec('git checkout gh-pages');
cp('-R', '../releases/*', '.');
exec('git checkout @{-1}');
cd('..');

// build
exec('npm run build-dist');
cd('demo');
mkdir('-p', 'dist');
cp('-R', '../dist/*', './dist/');
mkdir('-p', 'releases');
cp('-R', '../.ghpages-tmp/*', './releases/');
cd('..');
var version = 'v' + require(path.join(__dirname, '../package.json')).version + '/';
var versionDir = path.join(paths.releases, version);
mkdir('-p', versionDir)
cp(paths.redocBuilt + '.min.js', versionDir);
cp(paths.redocBuilt + '.min.js', path.join(paths.releases, 'latest/'));
