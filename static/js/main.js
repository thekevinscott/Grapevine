// Author: Thomas Davis <thomasalwyndavis@gmail.com>
// Filename: main.js

// Require.js allows us to configure shortcut alias
// Their usage will become more apparent futher along in the tutorial.



require.config({
  paths: {
    jquery: 'http://ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min',
    jqueryui: 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/jquery-ui.min',
    
    underscore: 'libs/underscore/underscore-min',
    backbone: 'libs/backbone/backbone-optamd3-min',
    facebook: '//connect.facebook.net/en_US/all',
    paper: 'libs/paper/paper',
    tween: 'libs/tween/tween',
    fancybox: 'libs/jquery.fancybox.pack',
    effects: 'libs/jquery/effects.core',
    text: 'libs/require/text',
    templates: '../templates'
  },
  urlArgs: "bust=" +  (new Date()).getTime()

});

require([
  'app'
], function(App){
  App.initialize();
});

