var NwBuilder = require('node-webkit-builder');
var nw = new NwBuilder({
    files: './**/**', // use the glob format
    platforms: ['win','osx']
});

// Log stuff you want
nw.on('log',  console.log);

nw.build().then(function() {
  console.log('done!');
});