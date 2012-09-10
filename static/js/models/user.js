define([
  
  'underscore',
  'backbone'
], function(_, Backbone){
  return Backbone.Model.extend({
    defaults : {
      name : '',
      friends : []
    },
    initialize : function() {
      /*
      Grapevine.setUser(this);
      this.bind("change", function(){
        Grapevine.setUser(this);
      });*/
    }
  });
});
