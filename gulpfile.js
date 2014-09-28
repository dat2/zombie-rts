var gulp = require('gulp'),
  g = require('gulp-load-plugins')();

var mainBowerFiles = require('main-bower-files'),
  path = require('path');

gulp.task('imagemin', function() {
  return gulp.src('assets/images/*')
    .pipe(g.changed('assets/images'))
    .pipe(g.imagemin())
    .pipe(gulp.dest('assets/images'));
});

gulp.task('index', function() {
  return gulp.src('index.html')
    .pipe(g.inject(
      gulp.src(['scripts/*', 'styles/*'], {
        read: false
      }), {
        name: 'app',
        addPrefix: '/zombie-rts'
      }
    ))
    .pipe(g.inject(
      gulp.src(
        mainBowerFiles()
        .concat(['vendor/*']), {
          read: false
        }), {
        name: 'vendor',
        addPrefix: '/zombie-rts'
      }
    ))
    .pipe(gulp.dest('.'));
});

gulp.task('watch', ['index'], function() {
  g.livereload.listen();
  gulp.watch('index.html', ['index']);
  gulp.watch('assets/images', ['imagemin']);

  gulp.watch(['index.html', 'scripts/*', 'styles/*', 'vendor/*', 'assets/']).on('change', g.livereload.changed);
});