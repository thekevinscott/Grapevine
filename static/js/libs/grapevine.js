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
		var setHelp = function(params) {
			if (! help || ! help.length) {
				help = $('<div id="help-container"><div id="help"><div id="help-content"></div></div></div>');
				$('body').append(help);
			}

			$(help).find('#help-content').html(params.content);
			if (params.top) {
				$(help).find('#help').css({top : params.top});
			}
		};
		return {
			setUser : setUser,
			getUser : getUser,
			request : request,
			setHelp : setHelp
		}
	}();
})(jQuery);