define([
  
  'underscore',
  'backbone'
], function(_, Backbone){
  return Backbone.Model.extend({
    initialize : function() {
      Grapevine.setUser(this);
    },
    promptColor: function() {
      var cssColor = prompt("Please enter a CSS color:");
      this.set({color: cssColor});
    }
  });
});
