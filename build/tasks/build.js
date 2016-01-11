var gulp = require('gulp');
var runSequence = require('run-sequence');
var Builder = require('systemjs-builder');
var inlineNg2Template = require('gulp-inline-ng2-template');
var path = require('path');
var sourcemaps = require('gulp-sourcemaps');
var paths = require('../paths');
var fs= require('fs');
var concat = require('gulp-concat');
var gulp = require('gulp');
var sass = require('gulp-sass');
var replace = require('gulp-replace');
var rename = require('gulp-rename');

paths.redocBuilt = path.join(paths.output, paths.outputName);

gulp.task('build', function (callback) {
  return runSequence(
    'clean',
    'bundleProd',
    callback
  );
});

gulp.task('buildDev', function (callback) {
  return runSequence(
    'clean',
    'bundle',
    callback
  );
});


gulp.task('bundle', ['buildStatic', 'concatDeps']);
gulp.task('bundleProd', ['bundle', 'buildStaticMin', 'concatDepsMin']);

gulp.task('inlineTemplates', ['sass'], function() {
  return gulp.src(paths.source, { base: './' })
    .pipe(replace(/'(.*?\.css)'/g, '\'.tmp/$1\''))
    .pipe(inlineNg2Template({ base: '/' }))
    .pipe(gulp.dest(paths.tmp));
});

var JS_DEV_DEPS = [
  'node_modules/zone.js/dist/zone-microtask.js',
  'node_modules/reflect-metadata/Reflect.js'
];

var JS_DEV_DEPS_MIN = [
  'node_modules/zone.js/dist/zone-microtask.min.js',
  'node_modules/reflect-metadata/Reflect.js'
]

gulp.task('sass', function () {
  return gulp.src(paths.scss, { base: './' })
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest(paths.tmp));
});

// concatenate angular2 deps
gulp.task('concatDeps', ['buildStatic'], function() {
  return concatDeps(JS_DEV_DEPS, paths.redocBuilt + '.js');
});

gulp.task('concatDepsMin', ['buildStatic'], function() {
  return concatDeps(JS_DEV_DEPS_MIN, paths.redocBuilt + '.min.js');
});

gulp.task('buildStatic', ['inlineTemplates'], function(cb) {
  bundle(paths.redocBuilt + '.js', false, cb);
});

gulp.task('buildStaticMin', ['inlineTemplates'], function(cb) {
  bundle(paths.redocBuilt + '.min.js', true, cb);
});

function concatDeps(deps, file) {
  return gulp.src(deps.concat([file]))
  .pipe(sourcemaps.init({loadMaps: true}))
  .pipe(concat(file))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('.'))
}

function bundle(outputFile, minify, cb) {
  fs.existsSync('dist') || fs.mkdirSync('dist');
  var builder = new Builder('./', 'system.config.js');
  builder.config({
    separateCSS: true
  });

  builder
    .buildStatic(path.join(paths.tmp, paths.sourceEntryPoint),
      outputFile,
      { format:'amd', sourceMaps: true, lowResSourceMaps: true, minify: minify }
    )
    .then(function() {
      cb();
    })
    .catch(function(err) {
      cb(new Error(err));
    });
}
