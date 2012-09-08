var Grapevine = {};
(function($){
	Grapevine = function() {
		var config, facebook, pages, user;

		pages = {};

		config = {
			pages : [
				{
					title : 'login',
					dependencies : [
						{ src : '../static/js/facebook_scaffold.js' },
						{ src : "//connect.facebook.net/en_US/all.js", id : "facebook-jssdk" }
					],
					html : '<div class="fb-login-button" scope="email,user_checkins,user_likes,friends_likes,user_about_me,friends_about_me,user_education_history,friends_education_history,email,user_hometown,friends_hometown,user_relationships,friends_relationships,user_relationship_details,friends_relationship_details,user_religion_politics,friends_religion_politics,user_work_history,friends_work_history">Login with Facebook</div>'

				}
			]
		};
		var log = function(msg) {
			if (1 && window['console']) { console.log(msg); }
		}


		var loadJavascript = function(src,id) {
			
			d = document;

			var createRandomID = function() {
				id = 'script-'+Math.round(Math.random()*99999);
				if (d.getElementById(id)) { id = createRandomID(); }
				return id;
			}
			// Load the SDK Asynchronously
			
			var js, id, ref;
			if (! id ) { id = createRandomID(); }
			ref = d.getElementsByTagName('script')[0]
			if (d.getElementById(id)) {return;}
			js = d.createElement('script'); js.id = id; js.async = true;
			js.src = src;
			

			ref.parentNode.insertBefore(js, ref);
		}

		var loadPage = function(page) {
			var page_div = $('<div class="page" />');
			page_div.attr('id','page-'+page.title);
			page_div.html(page.html);
			
			$('body').append(page_div);
			$(page_div).css('left',(100*(pages.length-1))+'%');

			loadJavascript('../static/js/'+page.title+'.js');
			if (page.dependencies) {
				$.each(page.dependencies,function(i,dependency){
					loadJavascript(dependency.src, dependency.id);
				});
			}

			
			
		};
		var profile;
		var createProfile = function(user) {
			var page = $('.page:first');
			page.html('<div id="profile"></div>');
			profile = page.find('#profile');
			log(user);
			profile.html('<h1>'+user.name+'</h1>');
		};
		var updateProfile = function(field,data) {
			profile.append('<h2>'+field+'</h2>');
			var data_container = $('<ul />');
			$.each(data,function(key,val){
				data_container.append('<li>'+val+'</li>');
			});
			log(profile);
			$(profile).append(data_container);
		}


		/// init
		
		var run = function() {
			loadJavascript('../static/js/facebook.js');
			loadPage(config.pages[0]);
		};
		$('document').ready(function(){ run(); });
		return {
			loadJavascript : loadJavascript,
			config : config,
			facebook : facebook,

			pages : pages,

			createProfile : createProfile,
			updateProfile : updateProfile
		}
	}();
})(jQuery);