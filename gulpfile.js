var gulp = require('gulp'),
  g = require('gulp-load-plugins')();

var mainBowerFiles = require('main-bower-files'),
  del = require('del'),
  express = require('express');

var paths = {
  devDir: '.tmp/',
  imagesDir: 'asset/images/',
  scriptsDir: 'scripts/',
  stylesDir: 'styles/'
};

gulp.task('clean', function(done) {
  del.sync(paths.devDir);
  done();
});

gulp.task('scripts', function() {
  return gulp.src(paths.scriptsDir + '*.js')
    .pipe(g.plumber())
    .pipe(g.es6Transpiler())
    .pipe(g.es6ModuleTranspiler({
      type: 'amd',
      // prefix: 'scripts/'
    }))
    .pipe(gulp.dest(paths.devDir));
});

gulp.task('imagemin', function() {
  return gulp.src(paths.imagesDir + '*')
    .pipe(g.changed(paths.imagesDir))
    .pipe(g.imagemin())
    .pipe(gulp.dest(paths.imagesDir));
});

gulp.task('index', ['clean', 'scripts'], function() {
  return gulp.src('index.html')
    .pipe(g.inject(
      gulp.src([paths.devDir + '*', 'styles/*'], {
        read: false
      }), {
        name: 'app'
      }
    ))
    .pipe(g.inject(
      gulp.src(
        mainBowerFiles()
        .concat(['vendor/*']), {
          read: false
        }), {
        name: 'vendor',
      }
    ))
    //overwrite index
    .pipe(gulp.dest(paths.devDir));
});

gulp.task('serve', ['index', 'scripts'], function() {
  g.livereload.listen();

  var server = express()
    .use(require('connect-livereload')({
      port: 35729
    }))
    .use(express.static(paths.devDir))
    .use(express.static('.'));

  require('http').createServer(server).listen(9000);

  gulp.watch('index.html', ['index']);
  gulp.watch(paths.imagesDir, ['imagemin']);
  gulp.watch(paths.scriptsDir + '*', ['scripts']);

  gulp.watch(['index.html', paths.devDir + '*', paths.stylesDir + '*', 'vendor/*', 'assets/*']).on('change', g.livereload.changed);
});