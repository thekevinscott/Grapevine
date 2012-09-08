// Author: Thomas Davis <thomasalwyndavis@gmail.com>
// Filename: main.js

// Require.js allows us to configure shortcut alias
// Their usage will become more apparent futher along in the tutorial.



require.config({
  paths: {
    jquery:     'http://ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min',
    jqueryui:   'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/jquery-ui.min',
    underscore: 'static/libs/underscore/underscore-min',
    backbone:   'static/libs/backbone/backbone-optamd3-min',
    facebook:   '//connect.facebook.net/en_US/all',
    paper:      'static/libs/paper/paper',
    tween:      'static/libs/tween/tween',
    fancybox:   'static/libs/jquery.fancybox.pack',
    effects:    'static/libs/jquery/effects.core',
    text:       'static/libs/require/text',
    templates:  '../templates'
  },
  urlArgs: "bust=" +  (new Date()).getTime()

});

require([
  'app'
], function(App){
  App.initialize();
});

