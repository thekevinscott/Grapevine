var Grapevine;
(function($){
	Grapevine = function() {
		var user, help;
		var setUser = function(user) {
			this.user = user;
		};
		var getUser = function() {
			return (this.user) ? this.user : null;
		};
		var request = function(params) {
			params.url = 'http://grapevyne.herokuapp.com/api/'+params.url;
			$.ajax(params);
		};
		var setHelp = function(msg) {
			if (! help || ! help.length) {
				help = $('<div id="help"></div>');
				$('body').append(help);
			}
			$(help).html(msg);
		};
		return {
			setUser : setUser,
			getUser : getUser,
			request : request,
			setHelp : setHelp
		}
	}();
})(jQuery);