var gulp = require('gulp');
var runSequence = require('run-sequence');
var Builder = require('systemjs-builder');
var inlineNg2Template = require('gulp-inline-ng2-template');
var path = require('path');
var sourcemaps = require('gulp-sourcemaps');
var paths = require('../paths');
var fs= require('fs');
var concat = require('gulp-concat');

paths.redocBuilt = path.join(paths.output, paths.outputName);
gulp.task('build', function (callback) {
  return runSequence(
    'clean',
    'bundle',
    callback
  );
});

gulp.task('bundle', ['bundleSfx', 'concatDeps']);

gulp.task('inlineTemplates', function() {
  return gulp.src(paths.source, { base: './' })
    .pipe(inlineNg2Template({ base: '/' }))
    .pipe(gulp.dest(paths.tmp));
});

var JS_DEV_DEPS = [
  'node_modules/zone.js/dist/zone-microtask.js',
  'node_modules/reflect-metadata/Reflect.js'
];

// concatenate angular2 deps
gulp.task('concatDeps', ['bundleSfx'], function() {
  gulp.src(JS_DEV_DEPS.concat([paths.redocBuilt]))
  .pipe(sourcemaps.init({loadMaps: true}))
  .pipe(concat(paths.outputName))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(paths.output))
});

gulp.task('bundleSfx', ['inlineTemplates'], function(cb) {
  fs.existsSync('dist') || fs.mkdirSync('dist');
  var builder = new Builder('./', 'system.config.js');
  builder.config({
    separateCSS: true
  });

  builder
    .buildStatic(path.join(paths.tmp, paths.sourceEntryPoint),
      paths.redocBuilt,
      { globalName: 'Redoc', sourceMaps: true, lowResSourceMaps: true }
    )
    .then(function() {
      cb();
    })
    .catch(function(err) {
      cb(new Error(err));
    });
});
