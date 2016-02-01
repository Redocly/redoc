var gulp = require('gulp');
var gp = require('gulp-protractor');
var browserSync = require('browser-sync').create('bs-e2e');

gulp.task('test-server', function (done) {
  browserSync.init({
    open: false,
    notify: false,
    port: 3000,
    ghostMode: false,
    server: {
      baseDir: './tests/e2e',
      routes: {
        '/dist': './dist',
        '/swagger.yml': './demo/swagger.yml'
      },
    }
  }, done);
});


gulp.task('e2e', ['bundleProd', 'test-server'], function(done) {
  gulp.src(['tests/e2e/**/*.js'], { read:false })
  		.pipe(gp.protractor({
  			configFile: './protractor.conf.js'
  		})).on('error', function(e) {
  			browserSync.exit();
  			throw e;
  			done();
  		}).on('end', function() {
  			browserSync.exit();
  			done();
  		});
});
