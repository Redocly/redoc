var gulp = require('gulp');
var runSequence = require('run-sequence');
var Builder = require('systemjs-builder');
var inlineNg2Template = require('gulp-inline-ng2-template');
var path = require('path');

var paths = require('../paths');
var fs= require('fs');

gulp.task('build', function (callback) {
  return runSequence(
    'clean',
    'bundleSfx',
    callback
  );
});

gulp.task('inlineTemplates', function() {
  return gulp.src(paths.source, { base: './' })
    .pipe(inlineNg2Template({ base: '/' }))
    .pipe(gulp.dest(paths.tmp));
});

gulp.task('bundleSfx', ['inlineTemplates'], function(cb) {
  var builder = new Builder('./', 'system.config.js');
  builder
    .buildStatic(path.join(paths.tmp, paths.sourceEntryPoint),
      path.join(paths.output, 'redoc.full.js'),
      { globalName: 'Redoc', sourceMaps: true }
    )
    .then(function() {
      cb();
    })
    .catch(function(err) {
      cb(new Error(err));
    });
});
