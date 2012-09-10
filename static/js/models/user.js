define([  
  'underscore',
  'backbone'
], function(_, Backbone){
  return Backbone.Model.extend({
    defaults : {
      name : '',
      friends : []
    },
    initialize : function(params) {
      log(params);
      //Grapevine.setUser();
      /*
      Grapevine.setUser(this);
      this.bind("change", function(){
        Grapevine.setUser(this);
      });
      */
    }
  });
});