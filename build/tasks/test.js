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
        'lcovonly': 'coverage/lcov.info',
        'text-summary': 'coverage/text-summary.txt',
        'html': 'coverage'
      }
    }))
    .on('finish', function () {
      console.log('Remapping done!');
      console.log(cat('coverage/text-summary.txt').stdout);
      console.log('Test Done with exit code: ' + statusCode);
      if (process.env.TRAVIS) {
        console.log('uploading to coveralls')
        var out = cat('coverage/lcov.info').exec('coveralls');
        if (out.code !== 0) {
          console.warn('Failed upload to coveralls');
        }
      }
      done(statusCode);
    });
};
