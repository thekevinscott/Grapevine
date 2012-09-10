var Grapevine;
(function($){
	Grapevine = function() {
		var user, help_container, help, help_content;
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
			if (! help_container || ! help_container.length) {
				help_container = $('<div id="help-container"><div id="help"><div id="help-content"></div></div></div>');
				$('body').append(help_container);
			}
			help_content = help_container.find('#help-content');
			help = help_container.find('#help');
			
			help_content.html(params.content);
			
			var help_width = help.width();
			var help_height = help.height();

			if (params.top) {
				help.css({top : (params.top + (help_height / 2) )});
			}

			var total_help_time = 1000;
			var total_help_height_time = 200;

			log('animate width');
			help.css({width: 0, height: 10}).animate({width: help_width},{duration: total_help_time});

			setTimeout(function(){
				log('begin to animate height');
				help.stop().animate({width: help_width, height: help_height, top: params.top},
					{duration: total_help_time-total_help_height_time,easing: 'easeOutBounce'});
			},total_help_height_time);
		};
		return {
			setUser : setUser,
			getUser : getUser,
			request : request,
			setHelp : setHelp
		}
	}();
})(jQuery);