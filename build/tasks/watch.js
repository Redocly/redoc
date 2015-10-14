var gulp = require('gulp');
var paths = require('../paths');
var browserSync = require('browser-sync').get('bs');

function changed(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
}

gulp.task('watch', ['bundle'], function () {
  gulp.watch([ paths.source ], [ 'bundleSfx', browserSync.reload ]).on('change', changed);
  gulp.watch([ paths.html ], [ 'bundleSfx', browserSync.reload]).on('change', changed);
  gulp.watch([ paths.css ], [ 'bundleSfx', browserSync.reload]).on('change', changed);
  gulp.watch([ paths.demo ], [ '', browserSync.reload ]).on('change', changed);
});
