var gulp = require('./gulp')([
  'browserify',
  'clean',
  'inject',
  'serve',
  'imagemin'
]);
/*
gulp.task('build', ['browserify', 'compass', 'images']);
gulp.task('default', ['build', 'watch', 'serve', 'open']);

gulp.task('copy:images:dist', function() {
  console.log(paths.distDir + paths.imagesDir);
  return gulp.src(paths.imagesDir + '*')
    .pipe(gulp.dest(paths.distDir + paths.imagesDir));
});

gulp.task('copy:styles:dist', function() {
  return gulp.src(paths.stylesDir + '*')
    .pipe(gulp.dest(paths.distDir + 'css/'));
});

gulp.task('copy:maps:dist', function() {
  return gulp.src('assets/*.json')
    .pipe(gulp.dest(paths.distDir + 'assets/'));
});
*/