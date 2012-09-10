// Filename: views/home/main
define([

  'underscore',
  'backbone',


  'models/hunt',
  'text!templates/hunt/index.html'
], function( _, Backbone, Hunt, indexTemplate){

  var _view = Backbone.View.extend({
    el: null,
    user_attributes : null,
    template_data : null,
    initialize: function(){
      //this.collection = userModel;
      //this.collection.bind("add", this.exampleBind);
    },
    addComment : function(el) {
      var listing_container, listing_comments, new_comment;
      listing_container = $(el).parents('.listing-container');
      listing_comments = listing_container.find('.listing-comments');
      new_comment = $('<div class="new-comment-container"><textarea class="new-comment" name="'+listing_container.attr('id')+'-comment"></textarea></div>');
      listing_comments.prepend(new_comment);
      $(new_comment).hide().slideDown();

      alert('add a comment');
    },
    render: function(){
      var _this, data, access_token, page_title;
      _this = this;
      page_title = 'hunt';
      _this.el = _this.setupPage(page_title);

      _this.template_data = {
      	members: [
      		{ 
      			name : 'Kevin Scott',
      			id : 'thekevinscott',
      			color: '#42F4BB'
      		},
      		{ 
      			name : 'Beth Anne Katz',
      			id : '1000012313',
      			color: '#D9FF00'
      		},
      		{ 
      			name : 'Chris Ioffreda',
      			id : '1000112313',
      			color: '#9C24FF'
      		},

      	],
      	listings : [
      		{
      			id : 123,
      			member_id : 1000112313,
            image: 'static/images/house1.jpeg',
            address : '123 Main St',
            price: '$450 per room',
            content : '3 bedroom total. 2 bathrooms',
            comments : [
              {
                member_id : 'thekevinscott',
                member : 'Kevin Scott',
                content : 'I don\'t like this house'
              },
              {
                member_id : '1000012313',
                member: 'Beth Anne Katz',
                content : 'I don\'t like it either'
              },
              {
                member_id : '1000112313',
                member: 'Chris Ioffreda',
                content : 'Ditto'
              },
               
            ]
      		},
          {
            id : 124,
            member_id : '1000012313',
            image: 'static/images/house2.jpeg',
            address : '512 Forbes, 15213',
            price: '$550 per room',
            content : '3 bedrooms, pool in the backyard!',
          }
      	]
      };
      

      compiled_template = _.template( indexTemplate, _this.template_data );
      //log(data);



      _this.el.html(compiled_template);
      _this.el.find('.add_comment').click(function(e){
        e.preventDefault();
        _this.addComment(this);
      });
      $('#loading-page').fadeOut(function(){
        $(this).remove();
      });
      
    }
  });
  return new _view;
});
