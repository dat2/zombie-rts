var gulp = require('./gulp')([
  'scripts',
  'clean',
  'inject',
  'watch',
  'imagemin'
]);
// prepare the app in ".dist" folder?

var NwBuilder = require('node-webkit-builder');
var nw = new NwBuilder({
    files: './**/**', // change this of course
    platforms: ['win','osx']
});

// Log stuff you want
nw.on('log',  console.log);

nw.build().then(function() {
  console.log('done!');
});