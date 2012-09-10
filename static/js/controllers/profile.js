// Filename: views/home/main
define([
  
  'underscore',
  'backbone',
  'models/user',
  'text!templates/profile/login.html',
  'text!templates/profile/index.html'
], function( _, Backbone, User, loginTemplate, indexTemplate){

  var _view = Backbone.View.extend({
    el: null,
    user_attributes : null,
    template_data : null,
    initialize: function(){
      //this.collection = userModel;
      //this.collection.bind("add", this.exampleBind);
    },
    removeAttribute : function(e,el) {
      var poof, li, xOffset, yOffset, el_offset;
      var poof_frames, poof_height, poof_framerate, poof_frame, poof_interval;

      if (! el) { el = this; }


      poof = $('.poof');
      if (! poof.length) { poof = $('<div class="poof"></div>'); $('body').append(poof); }


      xOffset = 0;
      yOffset = -12;
      el_offset = $(el).offset();

      // remove clicked box from the document tree

      if ($(el)[0].tagName != 'LI' ) { el = $(el).parents('li'); }
      el.css({height: $(el).height(), overflow: 'hidden' }).animate({width: 0, opacity: 0, margin: 0, padding: 0},100, function(data){
        $(this).remove();
      });
      $('.poof').css({
        left: (el_offset.left + xOffset)+ 'px',
        top: (el_offset.top + yOffset) + 'px'
      }).show(); // display the poof <div>

      
      poof_frames = 5; // number of frames in the sprite animation
      poof_height = poof.height(); // size of poof <div> in pixels (32 x 32 px in this example)
      poof_framerate = 40; // set length of time each frame in the animation will display (in milliseconds)
      poof_frame = 0;
      // loop through amination frames
      // and display each frame by resetting the background-position of the poof <div>
      
      var animatePoof = function() {

        if (poof_frame>=poof_frames) {
          clearInterval(poofInterval);
          
          poof.hide();
        } else {
          
          poof.css({
            backgroundPosition: '0 ' + (0 - (poof_height*poof_frame)) + 'px',
            marginLeft: (0 - (4*poof_frame)) + 'px'
          });
        }
        poof_frame++;
      };

      animatePoof();

      poofInterval = setInterval(animatePoof,poof_framerate);

    },
    setUserAttribute : function(val,key) {
      var attr_div, attr_div_ul, _this;
      _this = this;
      var attr_div = $('#profile-'+key);

      if (! attr_div.length) {
        attr_div = $('<div id="profile-'+key+'" class="profile-container" />');
        this.user_attributes.append(attr_div);
      }
      attr_div.html('<h2>'+key+'</h2>');
      attr_div_ul = $('<ul></ul>');

      _(val).each(function(attribute_value){
        switch(key) {
          default :
            attr_div_ul.append('<li>'+attribute_value.name+'<a href="javascript:;" class="remove"></a></li>');

          break;
        }
        
      });
      

      
      
      attr_div.append('<a href="javascript:;" class="remove_all">Remove all</a>');
      attr_div.append(attr_div_ul);
      attr_div.append('<br class="clear" />'); 
      
      attr_div.hide().slideDown();
      attr_div_ul.find('li').each(function(){
        //$( this ).hide().show( 'blinds', null, 500 );
      });


      $(attr_div_ul).find('li .remove').click(_this.removeAttribute);
      
      $(attr_div).find('.remove_all').click(function(e){
        
        $(attr_div_ul).find('li').each(function(){
          _this.removeAttribute(e,$(this));
        });
        $(this).parents('.profile-container').slideUp(function(){
          $(this).remove();
        });
      });

    },
    userChange: function( user ){
      
      var _this;
      _this = this;
      if (! _this.user_attributes || ! _this.user_attributes.length) {
        _this.user_attributes = _this.el.find('#user-attributes');
      }

      _(user.changedAttributes()).each(function(val,key){

        if (-1 != $.inArray(key,[
            'activities',
            'books',
            'checkins',
            'events',
            'games',
            'groups',
            'interests',
            'likes',
            'links',
            'movies',
            'music',
            'notes',
            'questions',
            'subscribedto',
            'television'
          ])) {

          _this.setUserAttribute(val,key);
          
           
        }
        

      }, this);

    },
    getProfileDetails : function(response, callback) {
      var _this, access_token, compiled_template;
      
      _this = this;
      access_token = response.authResponse.accessToken;
      
      //var compiledTemplate = _.template( indexTemplate, this.template_data );
      
      FB.api('/me', function(data) {
        if (data) {
          if (callback) { callback(); }
          _this.user = new User(data);
          _this.user.bind("change",_this.userChange, _this);
          _this.template_data = {
            user: _this.user,
            _: _
          };
          compiled_template = _.template( indexTemplate, _this.template_data );
          _this.el.html(compiled_template);
          _this.el = _this.el.find('#profile');
          _this.user_attributes = _this.el.find('#user-attributes');
          var next_page = _this.el.find('#next-page');
          next_page.slideDown();
          var fields = [
            'activities',
            'books',
            'checkins',
            'events',
            'family',
            'friendlists',
            'friends',
            'games',
            'groups',
            'interests',
            'likes',
            'links',
            'locations',
            'movies',
            'music',
            'notes',
            'questions',
            'subscribedto',
            'television'
          ];

          $.each(fields,function(i,field){
            FB.api('/me/'+field, function(data) {
              
              if (data && data.data && data.data.length) {
                
                var params = {};
                params[field] = data.data;
                _this.user.set(params);
              }             
            });
          });
        }
      });
      
      

    },
    render: function(){
      var _this, data, access_token, page_title;
      _this = this;
      page_title = 'profile';
 
      
      // Load the SDK Asynchronously


      FB.getLoginStatus(function(response){
       //clearTimeout(timer);
        if (response.authResponse && response.authResponse.accessToken) {
          $('.fb-login-button').remove();
          _this.getProfileDetails(response,function(){
            _this.el = _this.setupPage(page_title);  
          });
          
        } else {

          _this.el = _this.setupPage(page_title);
          _this.el.html(loginTemplate);

          $('.fb-login-button').click(function(e){
          

            e.preventDefault();
            FB.login(function(response) 
            {
                if (response.authResponse) 
                {
                  alert('success');
                    //login success
                } 
                else 
                {
                    alert('User cancelled login or did not fully authorize.');
                }

            }, {scope: 'email,user_likes'})
          });
          FB.Event.subscribe('auth.login', function(response) {
            $('.fb-login-button').remove();
            _this.getProfileDetails(response,function(){
              _this.el = _this.setupPage(page_title);  
            });
          });
          //_this.el = _this.el.find('#profile');

        }
        
      });
    }
  });
  return new _view;
});
