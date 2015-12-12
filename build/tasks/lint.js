var gulp = require('gulp');
var eslint = require('gulp-eslint');
var paths = require('../paths');

gulp.task('lint', function () {
  return gulp.src([paths.source, paths.tests])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
