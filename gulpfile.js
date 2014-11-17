var gulp = require('gulp'),
  g = require('gulp-load-plugins')();

var mainBowerFiles = require('main-bower-files'),
  del = require('del'),
  browserSync = require('browser-sync'),
  path = require('path'),
  reload = browserSync.reload;

var paths = {
  devDir: '.tmp/',
  distDir: '../zombie-rts-dist/public/',

  imagesDir: 'assets/images/',
  scriptsDir: 'src/scripts/',
  stylesDir: 'src/styles/',
  index: 'src/index.html'
};

gulp.task('clean', function(done) {
  del.sync(paths.devDir);
  del.sync(paths.distDir, { force: true });
  done();
});

gulp.task('scripts', function() {
  return gulp.src(paths.scriptsDir + '{,**/}*.js')
    .pipe(g.sourcemaps.init())
    .pipe(g['6to5']())
    .pipe(g.header('define(\'<%= getModuleName(file) %>\', function(require, exports, module) {', {
      getModuleName: function(file) {
        var indexOfBaseDir = file.path.indexOf(paths.scriptsDir);

        // the module name will be the folders after basedir, all the way
        // to the filename without the extension.
        // eg. /src/scripts/a/b/c/d.js => a/b/c/d
        var moduleName = file.path.substring(indexOfBaseDir +
          paths.scriptsDir.length, file.path.lastIndexOf('.'));

        return moduleName;
      }
    }))
    .pipe(g.footer('});'))
    .pipe(g.changed(paths.devDir))
    .pipe(g.sourcemaps.write('.'))
    .pipe(gulp.dest(paths.devDir))
    .pipe(reload({stream:true}));
});

gulp.task('scripts:dist', function() {
  return gulp.src(paths.scriptsDir + '{,**/}*.js')
    .pipe(g.plumber())
    .pipe(g.sourcemaps.init())
    .pipe(g['6to5']())
    .pipe(g.header('define(\'<%= getModuleName(file) %>\', function(require, exports, module) {', {
      getModuleName: function(file) {
        var indexOfBaseDir = file.path.indexOf(paths.scriptsDir);

        // the module name will be the folders after basedir, all the way
        // to the filename without the extension.
        // eg. /src/scripts/a/b/c/d.js => a/b/c/d
        var moduleName = file.path.substring(indexOfBaseDir +
          paths.scriptsDir.length, file.path.lastIndexOf('.'));

        return moduleName;
      }
    }))
    .pipe(g.footer('});'))
    .pipe(g.concat('app-built.js'))
    .pipe(g.sourcemaps.write('.'))
    .pipe(gulp.dest(paths.distDir + 'js/'));
});

gulp.task('scripts:vendor:dist', function() {
  var src = ['/node_modules/gulp-6to5/node_modules/6to5/browser-polyfill.js']
    .concat(mainBowerFiles().filter(function(file) { return path.extname(file) === '.js'; }))
    .concat(['vendor/*.js']);

  return gulp.src(src)
    .pipe(gulp.dest(paths.distDir + 'js/vendor/'));
});

gulp.task('imagemin', function() {
  return gulp.src(paths.imagesDir + '*')
    .pipe(g.changed(paths.imagesDir))
    .pipe(g.imagemin())
    .pipe(gulp.dest(paths.imagesDir));
});

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
        ['node_modules/gulp-6to5/node_modules/6to5/browser-polyfill.js']
        .concat(mainBowerFiles())
        .concat(['vendor/*']), {
          read: false
        }), {
        name: 'vendor',
      }
    ))
    .pipe(gulp.dest(paths.devDir))
    .pipe(reload({stream:true}));
});

gulp.task('index:dist', function() {
  return gulp.src(paths.index)
    .pipe(g.inject(
      gulp.src([paths.distDir + 'js/app-built.js', paths.distDir + 'css/*.css'], {
        read: false
      }), {
        name: 'app',
        ignorePath: paths.distDir
      }
    ))
    .pipe(g.inject(
      gulp.src(paths.distDir + 'js/vendor/*.js', {
          read: false
        }), {
        name: 'vendor',
        ignorePath: paths.distDir
      }
    ))
    .pipe(gulp.dest(paths.distDir));
});

gulp.task('dist', ['scripts:dist', 'scripts:vendor:dist',
  'imagemin', 'copy:images:dist',
  'copy:styles:dist', 'copy:maps:dist', 'index:dist']);

gulp.task('serve', ['index', 'scripts'], function() {
  gulp.watch(paths.imagesDir, ['imagemin']);
  gulp.watch(paths.scriptsDir + '{,**/}*', ['scripts']);
  gulp.watch(paths.index, ['index']);

  browserSync({
    open: false,
    online: false,
    server: {
      baseDir: ['./', '.tmp'],
      index: paths.devDir + 'index.html',
    }
  });
});