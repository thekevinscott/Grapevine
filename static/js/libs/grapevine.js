var Grapevine;
(function($){
	Grapevine = function() {
		var user;
		var setUser = function(user) {
			this.user = user;
		}
		var getUser = function() {
			return (this.user) ? this.user : null;
		}
		return {
			setUser : setUser,
			getUser : getUser
		}
	}();
})(jQuery);