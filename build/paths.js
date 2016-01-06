module.exports = {
  source: 'lib/**/*.js',
  html: 'lib/**/*.html',
  scss: 'lib/**/*.scss',
  sourceEntryPoint: 'lib/index.js',
  outputName: 'redoc.full',
  output: 'dist/',
  tmp: '.tmp/',
  demo: 'demo/**/*',
  tests: '{lib,tests}/**/*.spec.js'
};
