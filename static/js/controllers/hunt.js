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
      var listing_container, listing, listing_comments, new_comment,message,username;
      $(el).slideUp();
      listing_container = $(el).parents('.listing-container');
      listing = listing_container.find('.listing');
      listing_comments = listing_container.find('.listing-comments');
      new_comment = $('<div class="new-comment-container"><form><textarea class="new-comment" name="'+listing_container.attr('id')+'-comment"></textarea><br class="clear" /><input type="submit" value="Comment" /></form></div>');
      listing.append(new_comment);
      new_comment.find('textarea').focus();
      
      $(new_comment).hide().slideDown();
      $(new_comment).find('form').submit(function(e){
        e.preventDefault();
        message = $(new_comment).find('textarea').val();
        username = 'Kevin Scott';
        id = 'thekevinscott';
        comment_id = 4;
        var new_comment_div = $('<div id="listing-comment-'+comment_id+'" class="listing-comment member-'+id+'"><p><strong>'+username+': </strong>'+message+'</p></div>');
        
        $(this).slideUp(function(){
          $(this).remove();
          $(el).slideDown();
          listing_comments.append('<div class="listing-arrow"></div>').append(new_comment_div);
          $('body').animate({scrollTop: new_comment_div.offset().top});
          new_comment_div.hide().slideDown();  
        });
      });

    },
    vote : function(params) {
      var listing = params.listing;
      var in = params.in;
      var rel = listing.attr('rel');
      var user = Grapevine.getUser();
    },
    render: function(){
      
      if (! Grapevine.getUser()) { window.location.hash = '#'; return;}
      log('hunt render');
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
                id: 1,
                member_id : 'thekevinscott',
                member : 'Kevin Scott',
                content : 'I don\'t like this house'
              },
              {
                id: 2,
                member_id : '1000012313',
                member: 'Beth Anne Katz',
                content : 'I don\'t like it either'
              },
              {
                id: 3,
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
      _this.el.find('.in').click(function(e){
        var img = $(this).find('img');
        var src = img.attr('src');
        var listing = $(this).parents('.listing');
        var rel = listing.attr('rel');
        if (src.split('/').pop() == 'in.png') {
          src = 'in-off.png';
          _this.vote({in : false, listing : listing});
        } else {
          src = 'in.png';
          _this.vote({in : true, listing : listing});
        }
      });
      $('#loading-page').fadeOut(function(){
        $(this).remove();
      });
      
    }
  });
  return new _view;
});
