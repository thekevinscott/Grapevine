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
      this.bind("change", function(params, two, anything){
        log(params);
        log(params.changedAttributes());
        log(two);
        log(anything);

        //Grapevine.setUser(this);
      });
      
    }
  });
});