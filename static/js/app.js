// Filename: app.js


define([
  
  'underscore',
  'backbone',
  
  'router', // Request router.js
], function(_, Backbone, Router){
  var initialize = function(){
    // Pass in our Router module and call it's initialize function
    Backbone.Collection.prototype.update = function(colIn){  

      var ids = [];

      _(colIn).each(function(modIn){
        
        var existing = this.get(modIn);
        // update existing models
        if (existing) { existing.set(modIn); }
        // add the new ones
        else { this.add(modIn); }

        ids.push(modIn.id);
      }, this);

      // remove missing models (optional)
      var toRemove = this.reject(function(model){
        return _(ids).include(model.id);
      });

      this.remove(toRemove);
      return this;
    };
    Router.initialize();
  }
  /*
  Backbone.View.prototype._super = function(funcName){
    return this.constructor.__super__[funcName].apply(this, _.rest(arguments));
  }*/
  Backbone.View.prototype.setupPage = function(page_title) {
    var el;
    Grapevine.clearHelp();
    Grapevine.stopLoading();
    
    if (! $('#page-'+page_title).length ) {
    
      el = $('<div id="page-'+page_title+'" class="page"></div>');
      $('#reel').append(el);  
    }
    
    el = $('#reel').find('#page-'+page_title);
    
    $('#reel').animate({marginLeft: '0%'});
    
    $('.page:not(#page-'+page_title+')').each(function(){
      if ($(this).attr('id')=='loading-page') {
        $(this).remove();
      } else {
        $(this).fadeOut();  
      }
      
    });
    
    
    return el;
  };
  

  return {
    initialize: initialize
  };
});
