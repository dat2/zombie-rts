var gulp = require('gulp'),
  g = require('gulp-load-plugins')(),
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer'),
  exorcist   = require('exorcist'),
  config = require('../config');

var browserify = require('browserify'),
  watchify = require('watchify'),
  to5browserify = require('6to5-browserify'),
  reload = require('browser-sync').reload;

function bundle() {
  var b = browserify({
    cache: {},
    packageCache: {},
    fullPaths: true,
    debug: true,
    extensions: ['.js']
  });

  if(watch) {
    b = watchify(b);
    b.on('update', function() {
      createBundle(b);
    });
  }

  b.add('./' + config.files.main);
  if(!dist) {
    createBundle(b);
  } else {
    createDistBundle(b);
  }
}

function createBundle(b) {
  b.transform(to5browserify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(config.paths.dev))
    .pipe(reload({
      stream: true
    }));
}

function createDistBundle(b) {
  b.transform(to5browserify)
    .bundle()
    .pipe(exorcist(config.paths.dist + 'js/bundle.min.js.map'))
    .pipe(source('bundle.min.js'))
    .pipe(buffer())
    .pipe(g.uglifyjs({
      inSourceMap: config.paths.dist + 'js/bundle.min.js.map',
      outSourceMap: './bundle.min.js.map'
    }))
    .pipe(gulp.dest(config.paths.dist + 'js/'));
}

gulp.task('browserify', function() {
  watch = true;
  dist = false;
  bundle();
});

gulp.task('browserify:dist', function() {
  watch = false;
  dist = true;
  bundle();
});
