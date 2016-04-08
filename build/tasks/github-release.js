var gulp = require('gulp');
var release = require('gulp-github-release');
var path = require('path');
var paths = require('../paths');

gulp.task('github-release', ['build'], function(){
  gulp.src(paths.redocBuilt + '.min.js')
    .pipe(release({
      token: process.env.GH_TOKEN,
      manifest: require(path.join(__dirname, '../../package.json'))
    }));
});
