module.exports = {
  source: 'lib/**/*.js',
  html: 'lib/**/*.html',
  scss: 'lib/**/*.scss',
  sourceEntryPoint: 'lib/index.js',
  outputName: 'redoc',
  output: 'dist/',
  tmp: '.tmp/',
  demo: 'demo/**/*',
  tests: '{lib,tests}/**/*.spec.js'
};
