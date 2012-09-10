// Author: Thomas Davis <thomasalwyndavis@gmail.com>
// Filename: main.js

// Require.js allows us to configure shortcut alias
// Their usage will become more apparent futher along in the tutorial.



require.config({
  paths: {
    underscore: 'libs/underscore/underscore-min',
    backbone:   'libs/backbone/backbone-optamd3-min',
    text:       'libs/require/text',
    templates:  '../templates'
  },
  urlArgs: "bust=" +  (new Date()).getTime()

});

require([
  'app',
  'jquery'
], function(App, $){
  App.initialize();
});

