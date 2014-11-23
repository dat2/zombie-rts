/**
 * This code automatically gets injected into .tmp/index.html before starting node-webkit.
 * When a file changes, node-webkit will reload itself with the new changes.
 */
var gulp = require('gulp'),
g = require('gulp-load-plugins')();

require('../gulp')(['inject', 'imagemin', 'scripts']);
var config = require('../gulp/config');

gulp.task('reload', function() {
  if(location) {
    location.reload();
  }
});

gulp.watch(config.paths.scripts + '{*/,}*.js', ['scripts', 'reload']);
gulp.watch(config.files.index, ['inject', 'reload']);
gulp.watch(config.files.images, ['imagemin', 'reload']);

process.on("uncaughtException", function(e) {
  console.log(e);
});
