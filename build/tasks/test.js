var gulp = require('gulp');

var Server = require('karma').Server;

/**
 * Run test once and exit
 */
gulp.task('test', ['concatPrism', 'inlineTemplates'], function (done) {
  new Server({
    configFile: __dirname + '/../../karma.conf.js',
    singleRun: true
  }, done).start();
});
