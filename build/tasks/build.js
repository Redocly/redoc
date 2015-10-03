var gulp = require('gulp');
var runSequence = require('run-sequence');
var Builder = require('systemjs-builder');
var path = require('path');

var paths = require('../paths');

gulp.task('build', function (callback) {
  return runSequence(
    'clean',
    ['bundle'],
    callback
  );
});

gulp.task('bundle', function(cb) {
  var builder = new Builder('./', 'system.config.js');
  builder
    .buildStatic(paths.sourceEntryPoint, path.join(paths.outputFolder, 'redoc.full.js'),
      { globalName: 'Redoc' })
    .then(function() {
      console.log('Bundle complete');
      cb();
    })
    .catch(function(err) {
      cb(new Error(err));
    });
});
