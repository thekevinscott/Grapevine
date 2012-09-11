var Grapevine;
(function($){
	Grapevine = function() {
		var user, help_container, help, help_content, loading_div;
		var loading  = function() {
			if (! loading_div || ! loading_div.length) {
				loading_div = $('<div id="loading-div"><img src="/static/images/loader_large_against_black.gif" width="220" /></div>');
				$('body').append(loading_div);
			}
			loading_div.fadeIn();
		};
		var stopLoading = function() {
			if (loading_div && loading_div.length) {
				loading_div.fadeOut();
			}
		}
		var setUser = function(user) {
			this.user = user;
		};
		var getUser = function() {
			return (this.user) ? this.user : null;
		};
		var request = function(params) {
			params.url = 'http://grapevyne.herokuapp.com/api/'+params.url;
			if (! params.type) { params.type = 'POST'; }
			params.cache = false;
			params.dataType = 'json';
			var error = (params.error) ? params.error : null;
			
			params.error = function(jqXHR, textStatus, errorThrown) {
				log('There was an error with an ajax request');
				log(jqXHR);
				log(textStatus);
				log(errorThrown);
				if (error) { error(jqXHR, textStatus, errorThrown); }
			};
			return $.ajax(params);
		};
		var setHelp = function(params) {
			if (! help_container || ! help_container.length) {
				help_container = $('<div id="help-container"><div id="help"><div id="help-content"></div></div></div>');
				$('body').append(help_container);
			}
			help_container.show();
			help_content = help_container.find('#help-content');
			help = help_container.find('#help');
			
			help_content.html(params.content);
			
			var help_width = help.width();
			var help_height = help.height();

			if (params.top) {
				help.css({top : (params.top + (help_height / 2) )});
			}

			var total_help_time = 500;
			var total_help_height_time = 100;

			log('animate width');
			help.css({width: 0, height: 10}).animate({width: help_width},{duration: total_help_time});

			setTimeout(function(){
				log('begin to animate height');
				help.stop().animate({width: help_width, height: help_height, top: params.top},
					{duration: total_help_time-total_help_height_time,easing: 'easeOutBounce'});
			},total_help_height_time);
		};
		var clearHelp = function() {
			if (help_container && help_container.length) {
				help_container.hide();	
			}
			
		}
		return {
			setUser 	: setUser,
			getUser 	: getUser,
			request 	: request,
			setHelp 	: setHelp,
			clearHelp 	: clearHelp,
			loading 	: loading,
			stopLoading	: stopLoading
		}
	}();
})(jQuery);