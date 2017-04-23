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

var version = require(path.join(__dirname, '../package.json')).version;
var versionDir = path.join(paths.releases, 'v' + version + '/');
var latestDir = path.join(paths.releases, 'latest/');
var v1Dir = path.join(paths.releases, 'v' + version.split('.')[0] + '.x.x/');
mkdir('-p', versionDir)
mkdir('-p', latestDir);
mkdir('-p', v1Dir);
cp(paths.redocBuilt, versionDir);
cp(paths.redocBuilt, latestDir);
cp(paths.redocBuilt, v1Dir);
