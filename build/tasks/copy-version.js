var gulp = require('gulp');
var path = require('path');
var paths = require('../paths');

gulp.task('copy-version', function() {
  var tag = 'v' + require(path.join(__dirname, '../../package.json')).version;
  gulp.src(paths.redocBuilt + '.min.js')
    .pipe(gulp.dest(path.join(paths.releases, tag)))
    .pipe(gulp.dest(path.join(paths.releases, 'latest')));
});
