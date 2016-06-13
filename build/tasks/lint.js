var gulp = require('gulp');
var tslint = require('gulp-tslint');
var paths = require('../paths');

gulp.task('lint', function () {
  return gulp.src([paths.source, paths.tests])
    .pipe(tslint({
      rulesDirectory: 'node_modules/codelyzer'
    }))
    .pipe(tslint.report(require('tslint-stylish'), {
      emitError: true,
      sort: true,
      bell: true
    }));
});
