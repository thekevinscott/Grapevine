(function($){
	Grapevine.facebook = function() {
		
		
		

		var fields = [
			'activities',
			'books',
			'checkins',
			'events',
			'family',
			'feed',
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

		var userUpdated = function(field) {
			// new content is updated
			Grapevine.updateProfile(field,user[field]);
		}

		var getLoginStatus = function(response) {
			//$('.fb-login-button').remove();

			// lets collect a smackload of data!
			FB.api('/me', function(data) {
				if (data) {
					
					user = data;
					Grapevine.createProfile(user);
					$.each(fields,function(i,field){
						FB.api('/me/'+field, function(data) {
							if (data && data.data && data.data.length) {
								user[field] = data.data;
								console.log(field);
								console.log(data);
								userUpdated(field);
							}						  
						});
					});
				}
			});
			
			
		}
		
		return {
			getLoginStatus : getLoginStatus
		}
	}();
})(jQuery);
    