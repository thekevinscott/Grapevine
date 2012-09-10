var log = function(msg){if (1 && window['console']) {console.log(msg); } }

// Filename: router.js
define([
  'jquery',
  //'jqueryui',
  'fancybox',
  'effects',
  'underscore',
  'backbone',
  'facebook',
  'paper',
  'tween',
  'controllers/profile',
  'controllers/web',
  'controllers/hunt'
], function($, /*$ui*/, fancybox, fx, _, Backbone, facebook, paperJS, tweenJS, profileView, webView, huntView){
  var AppRouter = Backbone.Router.extend({
    routes: {
      // Define some URL routes
      'projects': 'showProjects',
      'users': 'showUsers',
      'web' : 'web',
      'hunt' : 'hunt',

      // Default
      '*actions': 'profile'
    },
    web : function() {
      log('web view');
      
      webView.render();
    },
    hunt : function() {
      log('hunt');
      huntView.render();
    },
    profile: function(actions){
      profileView.render();
    }
  });

  var initialize = function(){

    var app_router = new AppRouter;
    Backbone.history.start();
  };
  return {
    initialize: initialize
  };
});
