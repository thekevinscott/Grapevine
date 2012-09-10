var Grapevine;
(function($){
	Grapevine = function() {
		var user;
		var setUser = function(user) {
			this.user = user;
		};
		var getUser = function() {
			return (this.user) ? this.user : null;
		};
		var request = function(params) {
			params.url = 'http://grapevyne.herokuapp.com/api/'+params.url;
			$.ajax(params);
		}
		return {
			setUser : setUser,
			getUser : getUser,
			request : request
		}
	}();
})(jQuery);