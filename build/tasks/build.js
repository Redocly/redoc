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
var gulpIf = require('gulp-if');
var sassCopm = require('node-sass');

gulp.task('build', function (callback) {
  if (argv.skipRebuild) {
    console.log('>>> Rebuild skipped')
    return callback();
  }
  return runSequence(
    'clean',
    'tsc',
    'inlineTemplates',
    'bundle',
    'concatDeps',
    'copyDebug',
    callback
  );
});

gulp.task('copyDebug', () => {
  if (!argv.prod) {
    // copy for be accessible from demo for debug
    cp(paths.redocBuilt + '.js', paths.redocBuilt + '.min.js');
  }
});

gulp.task('rebuild', function(done) {
  return runSequence(
    'tsc',
    'inlineTemplates',
    'bundle',
    'concatDeps',
    'copyDebug',
    done
  );
});

gulp.task('tsc', function() {
  exec('tsc -p ./tsconfig.json');
});

gulp.task('inlineTemplates', ['sass'], function() {
  return gulp.src('.tmp/lib/**/*.js', { base: './tmp' })
    .pipe(replace(/'(.*?)\.css'/g, '\'$1.scss\''))
    .pipe(inlineNg2Template({
      base: './',
      useRelativePaths: true,
      styleProcessor: compileSass,
      customFilePath: function(ext, file) {
        var cwd = process.cwd();
        var relative = path.relative(cwd, file);
        relative = relative.substring('5');
        return path.join(cwd, relative);
      }
    }))
    .pipe(gulp.dest(paths.tmp));
});

function compileSass(ext, file) {
    file = file.replace('../../shared/styles/variables', 'lib/shared/styles/variables');
    file = file.replace('json-schema-common', 'lib/components/JsonSchema/json-schema-common');
    file = file.replace('../../shared/styles/share-link', 'lib/shared/styles/share-link');
    file = file.replace('../JsonSchema/lib/components/JsonSchema/json-schema-common', 'lib/components/JsonSchema/json-schema-common');
    file = file.replace('../../styles/variables', 'lib/shared/styles/variables');

    return sassCopm.renderSync({data: file}).css;
}

var JS_DEPS = argv.prod ? [
  'lib/utils/browser-update.js',
  'node_modules/zone.js/dist/zone.min.js',
  'node_modules/reflect-metadata/Reflect.js',
  'node_modules/babel-polyfill/dist/polyfill.min.js'
]: [
  'lib/utils/browser-update.js',
  'node_modules/zone.js/dist/zone.js',
  //'node_modules/zone.js/dist/long-stack-trace-zone.js',
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
gulp.task('concatDeps', ['concatPrism'], function() {
  return gulp.src(JS_DEPS.concat([path.join(paths.tmp, 'prismjs-bundle.js'), outputFileName]))
    .pipe(gulpIf(!argv.prod, sourcemaps.init({loadMaps: true})))
    .pipe(concat(outputFileName))
    .pipe(gulpIf(!argv.prod, sourcemaps.write('.')))
    .pipe(gulp.dest('.'))
});

gulp.task('bundle', function bundle(done) {
  mkdir('-p', 'dist');
  cp('lib/index.js', path.join(paths.tmp, paths.sourceEntryPoint));
  var builder = new Builder('./', 'system.config.js');

  builder
    .buildStatic(path.join(paths.tmp, paths.sourceEntryPoint),
      outputFileName,
      { format:'umd', sourceMaps: !argv.prod, lowResSourceMaps: true, minify: argv.prod }
    )
    .then(() => {
      // wait some time to allow flush
      setTimeout(() => done(), 500);
    })
    .catch(err => done(err));
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
    .pipe(gulp.dest('.'));
});

// needs inlineTemplates run before to create .tmp/lib folder
gulp.task('injectVersionFile', ['inlineTemplates'], function() {
  var version = require('../../package.json').version;
  fs.writeFileSync(path.join(paths.tmp, 'lib/version.json'), JSON.stringify(version));
})
