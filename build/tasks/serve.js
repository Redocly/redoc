var gulp = require('gulp');
var browserSync = require('browser-sync').create('bs');

gulp.task('serve', ['watch'], function (done) {
  browserSync.init({
    open: false,
    notify: false,
    port: 9000,
    server: {
      baseDir: ['./demo', '.']
    }
  }, done);
});
