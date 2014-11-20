var gulp = require('gulp'),
  config = require('../config');

var browserSync = require('browser-sync');

gulp.task('serve', ['inject', 'browserify'], function() {
  gulp.watch(config.files.index, ['inject']);
  gulp.watch(config.files.images, ['imagemin']);

  browserSync({
    open: false,
    online: false,
    server: {
      baseDir: ['./', config.paths.dev],
      index: config.paths.dev + 'index.html',
    }
  });
});