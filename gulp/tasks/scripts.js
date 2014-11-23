var gulp = require('gulp'),
  g = require('gulp-load-plugins')();

var config = require('../config');

var to5options = {
  modules: 'amd',
  amdModuleIds: true
};

gulp.task('scripts', function() {
  return gulp.src(config.paths.scripts + '{*/,}*.js')
    .pipe(g.plumber())
    .pipe(g.changed(config.paths.dev))
    .pipe(g['6to5'](to5options))
    .pipe(gulp.dest(config.paths.dev));
});


// gulp.task('scripts:watch', function() {
  // return gulp.src(config.paths.scripts + '{*/,}*.js')
    // .pipe(g.watch(config.paths.scripts + '{*/,}*.js', function(files) {
/*      gulp.start('reload');
      return (files
        .pipe(g.plumber())
        .pipe(g['6to5'](to5options))
        .pipe(gulp.dest(config.paths.dev))
        .pipe(reload({ stream: true }))
        );
    }))
    .pipe(gulp.dest(config.paths.dev));
});*/