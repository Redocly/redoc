#!/usr/bin/env node
'use strict';
require('shelljs/global');

var paths = require('./paths');
var path = require('path');

set('-e');
set('-v');

// build
exec('npm run build-dist');
cd('demo');
mv('index-gh.html', 'index.html');
mkdir('-p', 'dist');
cp('-R', '../dist/*', './dist/');
cd('..');

var version = 'v' + require(path.join(__dirname, '../package.json')).version + '/';
var versionDir = path.join(paths.releases, version);
var latestDir = path.join(paths.releases, 'latest/');
mkdir('-p', versionDir)
mkdir('-p', latestDir);
cp(paths.redocBuilt + '.min.js', versionDir);
cp(paths.redocBuilt + '.min.js', latestDir);
