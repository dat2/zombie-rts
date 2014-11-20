var gulp = require('gulp'),
  g = require('gulp-load-plugins')();

var config = require('../config'),
  mainBowerFiles = require('main-bower-files'),
  reload = require('browser-sync').reload;

gulp.task('inject', function() {
  return gulp.src(config.files.index)
    .pipe(g.inject(
      gulp.src([config.paths.dev + '*', config.paths.styles + '*'], {
        read: false
      }), {
        name: 'app',
        ignorePath: config.paths.dev
      }
    ))
    .pipe(g.inject(
      gulp.src(
        ['node_modules/6to5-browserify/node_modules/6to5/browser-polyfill.js']
          .concat(mainBowerFiles())
      ),
        {
        name: 'vendor',
        }
    ))
    .pipe(gulp.dest(config.paths.dev))
    .pipe(reload({
      stream: true
    }));
});

// TODO
/*
gulp.task('inject:dist', function() {
  return gulp.src(config.files.index)
    .pipe(g.inject(
      gulp.src([config.paths.dev + '*', config.paths.styles + '*'], {
        read: false
      }), {
        name: 'app',
        ignorePath: config.paths.dev
      }
    ))
    .pipe(g.inject(
      gulp.src(
        ['node_modules/gulp-6to5/node_modules/6to5/browser-polyfill.js']
          .concat(mainBowerFiles())
      ),
        {
        name: 'vendor',
        }
    ))
    .pipe(gulp.dest(config.paths.dev))
    .pipe(reload({
      stream: true
    }));
});*/