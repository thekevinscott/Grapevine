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
    user : null,
    initialize: function(){
      //this.collection = userModel;
      //this.collection.bind("add", this.exampleBind);
      this.user = Grapevine.getUser();
    },
    addComment : function(el) {
      var listing_container, listing, listing_comments, new_comment,message,username,_this;
      _this = this;
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
        log(_this.user);
        username = _this.user.name;
        id = _this.user.id;
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
      var agree = params.agree;
      var rel = listing.attr('rel');
      var user = Grapevine.getUser();
      if (agree) {
        $(listing).append('<img src="/static/images/everybodys-in.png" class="everybodys-in" />').hide().slideDown();
      } else {
        $(listing).find('.everybodys-in').slideUp(function(){
          $(this).remove();
        })
      }
    },
    render: function(){
      
      if (! Grapevine.getUser()) { window.location.hash = '#'; return;}
      log('hunt render');
      var _this, data, access_token, page_title;
      _this = this;
      page_title = 'hunt';
      _this.el = _this.setupPage(page_title);

      var user = Grapevine.getUser();

      _this.template_data = {
      	members: [
          { 
            name : user.name,
            id : user.id,
            color: '#0918FF'
          },
      		{ 
      			name : 'Kevin Scott',
      			id : 'thekevinscott',
      			color: '#42F4BB'
      		},
      		{ 
      			name : 'Beth Anne Katz',
      			id : 'bethannekatz',
      			color: '#D9FF00'
      		},
      		{ 
      			name : 'Chris Ioffreda',
      			id : 'cioffreda',
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
                content : 'God I love this house'
              },
              {
                id: 2,
                member_id : 'bethannekatz',
                member: 'Beth Anne Katz',
                content : 'Guys, this is a great deal. I say we jump on it.'
              },
              {
                id: 3,
                member_id : 'cioffreda',
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
      log(_this.el.find('.in'));
      _this.el.find('.in').click(function(e){
        log('click');
        var img = $(this).find('img');
        log(img);
        var src = img.attr('src');
        log('src');
        var listing = $(this).parents('.listing');
        var rel = listing.attr('rel');
        if (src.split('/').pop() == 'in.png') {
          src = '/static/images/in-off.png';
          _this.vote({agree : false, listing : listing});
        } else {
          src = '/static/images/in.png';
          _this.vote({agree : true, listing : listing});
        }
        img.attr('src',src);
      });
      $('#loading-page').fadeOut(function(){
        $(this).remove();
      });
      setTimeout(function(){
            Grapevine.setHelp({content : 'These users are currently fake; in the future these will be the folks you selected on the last screen.', top: 150});
          },500);
      
    }
  });
  return new _view;
});
