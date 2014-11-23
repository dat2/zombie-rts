var gulp = require('gulp'),
  g = require('gulp-load-plugins')(),
  config = require('./gulp/config');

require('./gulp')(['scripts', 'inject', 'clean']);

// inject the livereload script before starting node-webkit
gulp.task('inject:livereload', function() {
  return gulp.src(config.files.index)
    .pipe(g.inject(gulp.src(['./nodewebkit-gulp-livereload.js']), {
      name: 'gulp',
      transform: function(filePath, file) {
        return '<script>' + file.contents.toString('utf8') + '</script>';
      }
    }))
    .pipe(gulp.dest('src'));
});

// this will inject all dependencies into .tmp/index.html before starting node-webkit.
gulp.task('default', ['inject:livereload', 'inject'], function(done) {
  require('child_process').exec('nodewebkit').unref();
});
/*
gulp.task('build', ['browserify', 'compass', 'images']);
gulp.task('default', ['build', 'watch', 'serve', 'open']);

gulp.task('copy:images:dist', function() {
  console.log(paths.distDir + paths.imagesDir);
  return gulp.src(paths.imagesDir + '*')
    .pipe(gulp.dest(paths.distDir + paths.imagesDir));
})

gulp.task('copy:styles:dist', function() {
  return gulp.src(paths.stylesDir + '*')
    .pipe(gulp.dest(paths.distDir + 'css/'));
});

gulp.task('copy:maps:dist', function() {
  return gulp.src('assets/*.json')
    .pipe(gulp.dest(paths.distDir + 'assets/'));
});
*/
