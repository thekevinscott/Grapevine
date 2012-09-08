window.fbAsyncInit = function() {

	FB.init({
    	appId      : '108916482593932', // App ID
    
    	status     : true, // check login status
    	cookie     : true, // enable cookies to allow the server to access the session
    	xfbml      : true  // parse XFBML
  	});
  	FB.getLoginStatus(function(response){

  		Grapevine.facebook.getLoginStatus(response);
  	});
};