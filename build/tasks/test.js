var gulp = require('gulp');

var Server = require('karma').Server;
var remapIstanbul = require('remap-istanbul/lib/gulpRemapIstanbul');

/**
 * Run test once and exit
 */
gulp.task('test', ['concatPrism', 'inlineTemplates', 'injectVersionFile'], function (done) {
  new Server({
    configFile: __dirname + '/../../karma.conf.js',
    singleRun: true
  }, karmaDone).start();

  function karmaDone (exitCode) {
  	remapCoverage(done, exitCode);
  }
});

function remapCoverage(done, statusCode) {
  console.log('Remapping coverage to TypeScript format...');
  gulp.src('coverage/**/coverage-final.json')
      .pipe(remapIstanbul({
          reports: {
              'lcovonly': 'coverage/remap/lcov.info',
              'text-summary': 'coverage/remap/text-summary.txt',
              'html': 'coverage/remap'
          }
      }))
      .on('finish', function () {
          console.log('Remapping done!');
          console.log(cat('coverage/remap/text-summary.txt').stdout);
          console.log('Test Done with exit code: ' + statusCode);
          done(statusCode);
      });
};
