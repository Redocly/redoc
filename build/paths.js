var path = require('path');

var paths = {
  outputName: 'redoc.min.js',
  output: 'dist/',
  demo: 'demo/**/*',
  releases: 'demo/releases/'
}

paths.redocBuilt = path.join(paths.output, paths.outputName);

module.exports = paths;
