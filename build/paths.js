var path = require('path');

var paths = {
  source: 'lib/**/*.js',
  html: 'lib/**/*.html',
  scss: 'lib/**/*.scss',
  sourceEntryPoint: 'lib/index.js',
  outputName: 'redoc',
  output: 'dist/',
  tmp: '.tmp/',
  demo: 'demo/**/*',
  tests: '{lib,tests}/**/*.spec.js',
  releases: 'demo/releases/'
}

paths.redocBuilt = path.join(paths.output, paths.outputName);

module.exports = paths;
