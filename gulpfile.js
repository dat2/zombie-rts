var gulp = require('gulp'),
  g = require('gulp-load-plugins')();

var mainBowerFiles = require('main-bower-files'),
  del = require('del'),
  browserSync = require('browser-sync')
  reload = browserSync.reload;

var paths = {
  devDir: '.tmp/',
  imagesDir: 'asset/images/',
  scriptsDir: 'src/scripts/',
  stylesDir: 'src/styles/',
  index: 'src/index.html'
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
    }))
    .pipe(g.changed(paths.devDir))
    .pipe(gulp.dest(paths.devDir))
    .pipe(reload({stream:true}));
});

gulp.task('imagemin', function() {
  return gulp.src(paths.imagesDir + '*')
    .pipe(g.changed(paths.imagesDir))
    .pipe(g.imagemin())
    .pipe(gulp.dest(paths.imagesDir));
});

gulp.task('index', ['clean', 'scripts'], function() {
  return gulp.src(paths.index)
    .pipe(g.inject(
      gulp.src([paths.devDir + '*', paths.stylesDir + '*'], {
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
    .pipe(gulp.dest(paths.devDir))
    .pipe(reload({stream:true}));
});

gulp.task('serve', ['index', 'scripts'], function() {
  gulp.watch(paths.imagesDir, ['imagemin']);
  gulp.watch(paths.scriptsDir + '*', ['scripts']);
  gulp.watch(paths.index, ['index']);

  browserSync({
    open: false,
    online: false,
    server: {
      baseDir: './',
      index: paths.devDir + 'index.html',
    }
  });
});