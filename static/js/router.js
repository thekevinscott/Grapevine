var log = function(msg){if (1 && window['console']) {console.log(msg); } }

// Filename: router.js
define([
  'underscore',
  'backbone',
  'controllers/profile',
  'controllers/web',
  'controllers/hunt'
], function(_, Backbone, profileView, webView, huntView){
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
