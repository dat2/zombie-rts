var gulp = require('gulp');

var del = require('del'),
  config = require('../config');

gulp.task('clean', function(done) {
  del.sync(config.paths.dev);
  del.sync(config.paths.dist, { force: true });
  done();
});