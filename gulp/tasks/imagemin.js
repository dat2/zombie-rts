var gulp = require('gulp'),
  g = require('gulp-load-plugins')(),
  config = require('../config');

gulp.task('imagemin', function() {
  return gulp.src(config.paths.images + '*')
    .pipe(g.changed(configs.paths.images))
    .pipe(g.imagemin())
    .pipe(gulp.dest(configs.paths.images));
});