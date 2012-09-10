// Author: Thomas Davis <thomasalwyndavis@gmail.com>
// Filename: main.js

// Require.js allows us to configure shortcut alias
// Their usage will become more apparent futher along in the tutorial.



require.config({
  paths: {
    jquery:     'libs/jquery/jquery.1.7.2',
    jqueryui:   'libs/jquery/jquery-ui.1.8.23',
    facebook:   'libs/facebook/facebook-min',
    underscore: 'libs/underscore/underscore-min',
    backbone:   'libs/backbone/backbone-optamd3-min',
    paper:      'libs/paper/paper',
    tween:      'libs/tween/tween',
    fancybox:   'libs/jquery.fancybox.pack',
    effects:    'libs/jquery/effects.core',
    text:       'libs/require/text',
    templates:  '../templates'
  },
  urlArgs: "bust=" +  (new Date()).getTime()

});

require([
  'app'
], function(App){
  console.log('is jquery around yet');
  console.log(jQuery);
  App.initialize();
});

