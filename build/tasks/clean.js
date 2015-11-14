var gulp = require('gulp');
var paths = require('../paths');
var del = require('del');
var vinylPaths = require('vinyl-paths');

gulp.task('clean', function () {
  return gulp.src([paths.output, paths.tmp])
    .pipe(vinylPaths(del));
});
