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
      var user;
      user = params;
      Grapevine.setUser(user);
      this.bind("change", function(params){
        log(params);
        log(params.changedAttributes());

        //Grapevine.setUser(this);
      });
      
    }
  });
});