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
var argv = require('yargs').argv;

gulp.task('build', function (callback) {
  if (argv.skipRebuild) {
    console.log('>>> Rebuild skipped')
    return callback();
  }
  return runSequence(
    'clean',
    'concatPrism',
    'bundle',
    'concatDeps',
    callback
  );
});

gulp.task('rebuild', function(done) {
  return runSequence(
    'bundle',
    'concatDeps',
    done
  );
});

gulp.task('inlineTemplates', ['sass'], function() {
  return gulp.src(paths.source, { base: './' })
    .pipe(replace(/'(.*?\.css)'/g, '\'.tmp/$1\''))
    .pipe(inlineNg2Template({ base: '/' }))
    .pipe(gulp.dest(paths.tmp));
});

var JS_DEPS = argv.prod ? [
  'lib/utils/browser-update.js',
  'node_modules/zone.js/dist/zone.min.js',
  'node_modules/reflect-metadata/Reflect.js',
  'node_modules/babel-polyfill/dist/polyfill.min.js'
]: [
  'lib/utils/browser-update.js',
  'node_modules/zone.js/dist/zone.js',
  'node_modules/zone.js/dist/long-stack-trace-zone.js',
  'node_modules/reflect-metadata/Reflect.js',
  'node_modules/babel-polyfill/dist/polyfill.js'
];

var outputFileName = paths.redocBuilt + (argv.prod ? '.min.js' : '.js');

gulp.task('sass', function () {
  return gulp.src(paths.scss, { base: './' })
    .pipe(sass.sync({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest(paths.tmp));
});

// concatenate angular2 deps
gulp.task('concatDeps', function() {
  return gulp.src(JS_DEPS.concat([outputFileName]))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(concat(outputFileName))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('.'))
});

gulp.task('bundle', ['inlineTemplates'], function bundle(cb) {
  fs.existsSync('dist') || fs.mkdirSync('dist');
  var builder = new Builder('./', 'system.config.js');

  builder
    .buildStatic(path.join(paths.tmp, paths.sourceEntryPoint),
      outputFileName,
      { format:'umd', sourceMaps: !argv.prod, lowResSourceMaps: true, minify: argv.prod }
    )
    .then(function() {
      // wait some time to allow flush
      setTimeout(() => cb(), 500);
    })
    .catch(function(err) {
      cb(new Error(err));
    });
});

gulp.task('concatPrism', function() {
  require('../../system.config.js');
  var prismFolder = System.normalizeSync('prismjs').substring(8);
  prismFolder = prismFolder.substring(0, prismFolder.length -3);
  var prismFiles = [
    'prism.js',
    'components/prism-actionscript.js',
    'components/prism-c.js',
    'components/prism-cpp.js',
    'components/prism-csharp.js',
    'components/prism-php.js',
    'components/prism-coffeescript.js',
    'components/prism-go.js',
    'components/prism-haskell.js',
    'components/prism-java.js',
    'components/prism-lua.js',
    'components/prism-matlab.js',
    'components/prism-perl.js',
    'components/prism-python.js',
    'components/prism-r.js',
    'components/prism-ruby.js',
    'components/prism-bash.js',
    'components/prism-swift.js',
    'components/prism-objectivec.js',
    'components/prism-scala.js'
  ].map(file => path.join(prismFolder, file));

  return gulp.src(prismFiles)
    .pipe(concat(path.join(paths.tmp, 'prismjs-bundle.js')))
    .pipe(gulp.dest('.'))
});
