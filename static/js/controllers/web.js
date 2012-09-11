
        var friends_no_search = [
                    {
                        id : 2,
                        name : 'Molly Shannon',
                        image : '',
                        
                        
                        friends : [
                            {
                                id : 1,
                                name : 'Kevin Scott',
                                image : 'http://graph.facebook.com/thekevinscott/picture?type=large',
                                looking : true,
                                attributes : {
                                    location: 'Shadyside, Pennsylvania',
                                    smoking: {
                                        value: 0,
                                        importance: 3
                                    },
                                    dog: {
                                        value: 1,
                                        importance: 5
                                    },
                                    questions : [
                                        {
                                            type: 'smoke',
                                            label : 'This person does not smoke.',
                                            question: 'Do you smoke?'
                                        },
                                        {
                                            type: 'dogs',
                                            label : 'This person has dogs.',
                                            question: 'Do you like dogs?'
                                        },
                                        
                                    ]
                                },
                            },
                            {
                                id : 11,
                                name : 'Beth Anne Katz',
                                image : 'http://graph.facebook.com/bethannekatz/picture?type=large',
                                connections : [10],
                                looking: true
                            }
                        ]
                    },
                    
                    {
                        id : 30,
                        name : 'Rodney Dangerfield',
                        image : '',
                        friends : [
                            {
                                id : 4,
                                name : 'Ralph Wiggum',
                                image : '',
                                friends : [
                                    {
                                        id: 7,
                                        name : 'Barack Obama',
                                        image : 'http://graph.facebook.com/barackobama/picture?type=large',
                                        looking : true
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id : 5,
                        name : 'Santa Clause',
                        image : '',
                        friends : [
                            {
                                id : 6,
                                name : 'Chris Ioffreda',
                                image : 'http://graph.facebook.com/cioffreda/picture?type=large',
                                looking: true
                            }
                        ]
                    }
                    ];

        var friends_search = [
                    {
                        id : 2,
                        name : 'Molly Shannon',
                        image : '',
                        
                        
                        friends : [
                            {
                                id : 1,
                                name : 'Kevin Scott',
                                image : 'http://graph.facebook.com/thekevinscott/picture?type=large',
                                looking : true,
                                attributes : {
                                    location: 'Shadyside, Pennsylvania',
                                    smoking: {
                                        value: 0,
                                        importance: 3
                                    },
                                    dog: {
                                        value: 1,
                                        importance: 5
                                    },
                                    questions : [
                                        {
                                            type: 'smoke',
                                            label : 'This person does not smoke.',
                                            question: 'Do you smoke?'
                                        },
                                        {
                                            type: 'dogs',
                                            label : 'This person has dogs.',
                                            question: 'Do you like dogs?'
                                        },
                                        
                                    ]
                                },
                            },
                            {
                                id : 11,
                                name : 'Beth Anne Katz',
                                image : 'http://graph.facebook.com/someone/picture?type=large',
                                connections : [10],
                                looking: true
                            }
                        ]
                    },
                    {
                        id : 5,
                        name : 'Santa Clause',
                        image : '',
                        friends : [
                            {
                                id : 6,
                                name : 'Chris Ioffreda',
                                image : 'http://graph.facebook.com/cioffreda/picture?type=large',
                                looking: true
                            }
                        ]
                    }
                    ];

define([

  'underscore',
  'backbone',
  
  
  
  'models/web',
  'models/user',
  'text!templates/web/index.html'
], function( _, Backbone, Web, User, indexTemplate){

  var _view = Backbone.View.extend({
    el: null,
    user_attributes : null,
    template_data : null,
    initialize: function(){
      //this.collection = userModel;
      //this.collection.bind("add", this.exampleBind);

    },
    setupTextField : function() {
    	var text_field, form, val, text_field_p;
    	text_field = $('#search-field-container #search-field');
        text_field_p = $('#search-field-container #text_field_p');
    	form = text_field.parents('form');
        var setHint = function(text_field) {
            text_field.val(text_field.attr('rel'));
            text_field.addClass('hint');
        }
        if (! text_field.val() && text_field.attr('rel')) {
            setHint(text_field);
        }
        $(text_field).focus(function(){
            if (text_field.attr('rel') && text_field.attr('rel') == text_field.val()) {
                text_field.val('');
                text_field.removeClass('hint');
            }
        });
        $(text_field).blur(function(){
            if (text_field.attr('rel') && '' == text_field.val()) {
                setHint(text_field);
            }
        });
    	$(form).submit(function(e){
    		e.preventDefault();
    		val = $(text_field).val();
            /*
            if (val) {
                init(friends_search);
            } else {
                init(friends_no_search);
            }
            */
            $(text_field).blur();
            $(text_field).animate({opacity: 0, marginTop: 40});
            $(text_field_p).html(val);
            $(text_field_p).show().css({opacity: 0}).animate({opacity: 1, marginTop: 49});
            $(text_field_p).mouseover(function(e){
                $(text_field).stop().animate({opacity : 1});
                $(text_field_p).stop().animate({opacity: 0});
            }).mouseout(function(e){

                $(text_field).stop().animate({opacity : 0});
                $(text_field_p).stop().animate({opacity: 1});
            });
            $(text_field_p).click(function(e){
                $(text_field).focus();    
                $(text_field_p).unbind('mouseover').unbind('mouseout');
                //$(text_field).animate({opacity: 1, marginTop: 0});
                
                //$(text_field_p).animate({opacity: 0, marginTop: 9});
            });
    	});
    },
    render: function(){

      if (! Grapevine.getUser()) { window.location.hash = '#'; return;}
      log('web render');
      var _this, data, access_token, duration;
      _this = this;
      duration = 200;
      
      page_title = 'web';
      
      _this.el = _this.setupPage(page_title);

      var transition_amount = 70;
      log(_this.el);
      var css = {
        left : 0, 
        opacity : 0, 
        width: (100-transition_amount)+'%', 
        height: (100-transition_amount)+'%', 
        marginTop: ((transition_amount/2))+'%',
        marginLeft: ((transition_amount/2))+'%'};
        log(css);
      var animate_params = {marginLeft : 0, marginTop : 0, width: '100%', height: '100%', opacity : '1'};
      log(animate_params);
      _this.el.css(css).animate(animate_params, { duration : duration, /*easing : 'easeOutQuad' ,*/ complete : function() {
        log('all ready');
        $('.slider').slider({
          max : 5,
          min : 1
        });
        setTimeout(function(){
            _this.setupPaper();
        },1000);
        
        setTimeout(function(){
            $('#sliders').animate({bottom: 0});
            $('#search-field-container').fadeIn();
            _this.setupTextField();
        },1500);
        

      }});
      //$('#reel').append(_this.el);

      //$('#reel').animate({marginLeft: '-100%'});
      _this.template_data = {};
      compiled_template = _.template( indexTemplate, _this.template_data );
      //log(data);


      _this.el.html(compiled_template);
      
      
    },
    setupPaper : function() {
    	paper.setup($('canvas').attr('id')); 
    	setInterval(function(){
    		view = paper.View._viewsById[$('canvas').attr('id')];
    		if (view) { view.draw(true); }
    		view.fire('resize', {
    			size: view.size,
    			delta: new paper.Point()
    		});
    	},1);


    	// defined vars are uppercase
    	// classes start with uppercase letters
    	// variables have underscores
    	// functions are camel case



    	var DEBUG, CELL_CREATE_TIME, CELL_DISTANCE, CELL_RADIUS, INITIAL_ANGLE_OFFSET, 
    		CELL_DELAY_CREATE_TIME, CELL_RADIUS_SCALE, CELL_NOISE, CELL_BEZIER,
    		CELL_SHAKE;
    	var Cell, objects, cells, queued_cells, cell_friends, lines, bottom_cell, groups, stage;


    	// init
    	DEBUG = true;
    	CELL_CREATE_TIME = 1000;
    	CELL_DELAY_CREATE_TIME = 40;
    	CELL_DISTANCE = 110;
    	CELL_RADIUS = 7;
    	CELL_RADIUS_SCALE = 1.4;
    	CELL_NOISE = 20;
    	CELL_BEZIER = 150;
    	CELL_SHAKE = 1.05;
    	INITIAL_ANGLE_OFFSET = Math.round(Math.random()*360)  * Math.PI / 180;
    	objects = [];
    	cells = [];
    	lines = [];
    	queued_cells = {};
    	cell_friends = {};


    	groups = {cells : (new paper.Group()), lines : (new paper.Group())};
    	stage = new paper.Group([groups.cells, groups.lines]);


    	var registerObject = function(obj) {
    		//arr = params.arr;
    		//group = params.group;
    		objects.push(obj);
    		//if (arr) { arr.push(obj); }
    		
    	}
    	var log = function(msg) {
    		if (DEBUG && window['console']) { console.log(msg); }
    	}

    	var Line = function(cells) {

    		var line, cell_a, cell_b, cell_a_position, cell_b_position;
            log(cell_friends);
            log(cells);
            
    		cell_a = cell_friends[cells.shift()];
    		cell_b = cell_friends[cells.shift()];



    		
    		line = new paper.Path();
    		line.strokeColor = '#000000';
            if (! cell_a || !cell_b) {
                return;
            }
    		cell_a_position = cell_a.getPosition();
    		cell_b_position = cell_b.getPosition();

    		line.add(new paper.Point(cell_a_position.x, cell_a_position.y));	
    		line.add(new paper.Point(cell_b_position.x, cell_b_position.y));	
    		//var friend_position = cell_friends[connection].getPosition();
    		
    		

    		//lines[connection] = line;

    		
    		line.curves[0].handle1.x = Math.random()*CELL_BEZIER - CELL_BEZIER/2;
    		line.curves[0].handle1.y = Math.random()*CELL_BEZIER - CELL_BEZIER/2;
    		line.curves[0].handle2.x = Math.random()*CELL_BEZIER - CELL_BEZIER/2;
    		line.curves[0].handle2.y = Math.random()*CELL_BEZIER - CELL_BEZIER/2;

    		groups.lines.addChild(line);
    		registerObject(line);
    		//line_collection.push(line);

    		var update = function(params)
    		{
    			
    			var bezier_scale = params.bezier_scale;

    			cell_a_position = cell_a.getPosition();
    			cell_b_position = cell_b.getPosition();

    		
    			line.segments[0].point.x = cell_a_position.x;
    			line.segments[0].point.y = cell_a_position.y;
    			line.segments[1].point.x = cell_b_position.x;
    			line.segments[1].point.y = cell_b_position.y;

    			if (bezier_scale) {
    				

    				line.curves[0].handle1.x = line.curves[0].handle1.x * bezier_scale;
    				line.curves[0].handle1.y = line.curves[0].handle1.y * bezier_scale;
    				line.curves[0].handle2.x = line.curves[0].handle2.x * bezier_scale;
    				line.curves[0].handle2.y = line.curves[0].handle2.y * bezier_scale;

    			}
    				
    		
    	    	
    		};

    		var me = {
    			update : update
    		};
    		cell_a.registerLine(me);
    		cell_b.registerLine(me);

    		return me;
    	}

    	var addLine = function(cells) {
    		if (cells.length>=2) {
    			cells.sort();
    			var key = cells[0]+'_'+cells[1];
    			if (! lines[key]) {

    				lines[key] = new Line(cells) ;
    			}
    		}
    	}

    	var Cell = function(params) {
    		
    		var x, y, starting_x, starting_y, target_x, target_y, radius;
            var stroke_width, looking_stroke_color, not_looking_stroke_color, looking_fill_color, not_looking_fill_color; 
    		var _this, id, name, attributes, looking, lines, connections, children, parent, image; 
    		var cell_lines, current_radius;

    		var path, creating, hovering, shaking, ready;

    		_this = this;

    		children = params.children;
    		parent = params.parent;
            looking = params.looking;
    		

    		ready = false;
    		creating = false;
    		hovering = false;
    		shaking = false;
    		id = params.id;

    		

    		// do we have starting x, y? if so, we will use x,y as our target

    		if (params.starting_x && params.starting_y) {
    			x = starting_x = params.starting_x;
    			y = starting_y = params.starting_y;

    			target_x = params.x;
    			target_y = params.y;
    		} else {
    			//otherwise we just use x, y as everything
    			x = params.x;
    			y = params.y;
    			starting_x = x;
    			starting_y = y;

    			target_x = params.x;
    			target_y = params.y;
    		}


    		//starting_x += Math.round((Math.random() * CELL_NOISE) * 2 - CELL_NOISE);
    		//starting_y += Math.round(Math.random() * (CELL_NOISE*2-CELL_NOISE));

    		radius = params.radius || CELL_RADIUS;
    		starting_radius = params.starting_radius || 0.01;
    		looking_stroke_color = params.stroke_color || '#000';
            looking_fill_color = params.fill_color || '#FFF';
            not_looking_stroke_color = '#111';
            not_looking_fill_color = '#444';
    		stroke_width = params.stroke_width || 1;
    		

    		name = params.name;
    		attributes = params.attributes;
            image = params.image || 'http://graph.facebook.com/'+(Math.round(Math.round(10000000)) + 100000)+'/picture?type=large';

    		lines = [];
    		connections = params.connections;
    		
    		

    		cell_lines = [];

    		current_radius = starting_radius;

    		var getPosition = function() {
    			return {x : x, y : y};
    		}
    		var getPath = function() {
    			return path;
    		}
    		var getState = function() {
    			if (hovering) { return 'hovering'; }
    			else if (shaking) { return 'shaking'; }
    			else { return null ; }
    		}
    		var getAttributes = function(key) {
    			if (attributes && attributes[key]) { return attributes[key]; }
    			else { return ''; }
    		}

    		var registerLine = function(line) {
    			lines.push(line);
    		}


            var group_window;
            var addToGroup = function(id) {
                log(group_window);
                if (! group_window) {
                    group_window = $('#group');

                }
                var info_window = $('#info-window-'+id);
                var group_content = $('#group-content');
                group_window.animate({right: 0});
                var genieEffect = function() {
                    info_window.animate({left: $(window).width(), width: '160px', height: '110px', marginLeft: '-190px', marginTop: 0, top: '10px'});
                }
                var bubbleEffect = function() {
                    var marginTop = parseInt(info_window.css('marginTop'));
                    info_window.animate({marginTop: (marginTop-8) + 'px', opacity: 0}, function(){
                        $(this).remove();
                    });
                    
                    var img = $('<img width="180" src="'+image+'" />');
                    $(group_content).prepend(img);
                    $(img).hide().slideDown();
                }
                if (Math.floor(Math.random()*2) ) {
                    bubbleEffect();
                } else {
                    bubbleEffect();
                }
                
            }
    		var infoWindow = function(point) {
                
                point.x = point.event.event.clientX;
                point.y = point.event.event.clientY;
    			var top, left, info_window, amount_to_move, time_to_create, id;
    			id = point.id;
    			
    			info_window = $('<div id="info-window-'+id+'" class="info-window"></div>');
    			$('body').append(info_window);

    			amount_to_move = 8;
    			time_to_create = 400;

                top = point.y - info_window.height() + 20;
                log('top: ' + top);
                if (top <= 90) {
                    log('it gonna go off screen');
                    top = point.y + (info_window.height()*2) + 20;    
                }
    			
    			left = point.x - (info_window.width()/2);
    			info_window.addClass('show');
    			info_window.css({
    				display : 'block', 'top' : top + amount_to_move, 'left' : left
    			}).animate({
    				opacity : 'show', top: top - amount_to_move
    			},{ duration :time_to_create/*, easing: 'easeOutQuad'*/});

    			info_window.html('<img width="50" src="'+image+'" /><h1>'+name+'</h1><p class="location">'+getAttributes('location')+'</p>');
    			
    			info_window.width(200);
    		};


    		var clearInfoWindow = function(id) {
    			
    			var info_window, top;
    			info_window = $('#info-window-'+id);
    			
				top = parseInt(info_window.css('top'));
				
				info_window.animate({top: top-10, opacity : 'hide'},function(){
					$(this).remove();
				});	
    		};
    		var expandInfoWindow = function(info_window,event) {
                
    			var width = info_window.width();
    			var height = info_window.height();

    			var target_width = 300;
    			var target_height = 100;
                var margin_top;
                if (event.event.clientY - target_height < 30) {
                    margin_top = target_height - 70;
                } else {
                    margin_top = -1 * target_height;
                }
    			$(info_window).animate({
    				width: target_width,
    				height: target_height,
    				marginLeft : -1 * target_width / 2 + 50,
    				marginTop : margin_top
    			},200);
    			$(info_window).append('<a href="javascript:;" class="add"><img src="/static/images/add-to-vine.png" width="185" /></a><br class="clear" />');
                $(info_window).find('.add').click(function(e){

                    var html = $('<div id="warning" />');
                    var question_count = 0;
                    if (attributes && attributes.questions && attributes.questions.length) {
                        $.each(attributes.questions,function(i,question){
                            
                            var button = (question_count < attributes.questions.length-1) ? 
                                '<a href="javascript:;" rel="'+question_count+'" class="button">Next</a>' : 
                                '<a href="javascript:;" rel="'+question_count+'" class="button">Submit</a>';
                            var question_html = '<div class="question" style="left: '+(0+(440*question_count))+'px;">\
                                <h1>'+question.label+'</h1>\
                                <p>'+question.question+'</p>\
                                <label>Yes</label><input type="radio" group="answer" value="1" />\
                                <label>No</label><input type="radio" value="0" group="answer" />\
                                <hr />\
                                <p>How important is this to you?</p>\
                                <label>Not at all</label><input type="radio" group="answer" value="0" />\
                                <label>Somewhat</label><input type="radio" group="answer" value="1" />\
                                <label>Very important</label><input type="radio" group="answer" value="2" />\
                                <label>Dealbreaker</label><input type="radio" group="answer" value="3" />\
                                <br /><br class="clear" /><br />\
                                '+button+'\
                                <br class="clear" />\
                                </div>';
                            html.append(question_html);
                            question_count++;

                        });
                        html.append('<br class="clear" />');
                        
                        $.fancybox.open( html );
                        $('#warning').find('.button').click(function(){
                            if (parseInt($(this).attr('rel'))==attributes.questions.length-1) {
                                $.fancybox.close();
                                addToGroup(id);
                            } else {
                                $('#warning').animate({marginLeft : '-440px'});    
                            }
                            
                        });
                    } else {
                        addToGroup(id);
                    }
                    
                });

    		};

    		
    		var shakeTheWeb = function(params) {
    			var shake = params.shake;
    			var amount = params.amount;
    			if (! amount ) { amount = 0.5}
    			var all_connections = [];
    			$.each({one : connections, two : children},function(i,arr){
    				if (arr && arr.length) {
    					$.each(arr,function(i,connection){
    						if (typeof(connection)=='object') {
    							connection = connection.id;
    						}
    						
    						all_connections.push(connection);
    					});	
    				}
    			});
    			
    			$.each(all_connections,function(i,connection){
                    if (cell_friends[connection]) {
                        cell_friends[connection].shake({shake : shake, amount : amount, shaker : id});    
                    }
    				
    			});
    			
    		}
    		var shake = function(params) {

    			var amount = params.amount;
    			var shaker = cell_friends[params.shaker];
    			var shake = params.shake;

    			if (! hovering && amount < 5) {
    				var tween_start_args, tween_end_args;
    				shaking = true;

    				var middle_x, middle_y;
    				var shaker_position = shaker.getPosition();
    				//log('shake: ' + shake);
    				if (! shake) {
    					//log('end the shake');

    					tween_start_args = { x : x, y : y};
    					tween_end_args = { x : target_x, y : target_y};	
    				} else {
    					//log('start the shake');
    					var cell_shake_amount = ((CELL_SHAKE-1) / (amount)) + 1;

    					var horizontal_side = ((target_x - shaker_position.x ) * cell_shake_amount) - ((target_x - shaker_position.x));
    					var vertical_side = ((target_y - shaker_position.y) * cell_shake_amount) - ((target_y - shaker_position.y));
    					

    					// a^2 + b^2 = c^2
    					middle_x = target_x+horizontal_side;
    					middle_y = target_y+vertical_side;
    					
    					tween_start_args = { x : x, y : y};
    					tween_end_args = { x : middle_x, y : middle_y};
    		
    				}
    				
    				
    				
    				
    				var tween = new TWEEN.Tween( tween_start_args).to( tween_end_args, 1500 )
    				.easing( TWEEN.Easing.Elastic.Out ).onUpdate( function () {
    					var update_params = this;
    					update_params.path = path;
    					update(update_params); 
    				}).start().onComplete( function() {
    					shaking = false;
    					/*
    					var tween_start_args = { x : middle_x, y : middle_y};
    					var tween_end_args = { x : target_x, y : target_y};
    					var tween = new TWEEN.Tween( tween_start_args).to( tween_end_args, 500 )
    					.easing( TWEEN.Easing.Elastic.Out ).onUpdate( function () {
    						var update_params = this;
    						update_params.path = path;
    						update(update_params); 
    					}).start().onComplete(function(){
    						shaking = false;
    					});*/
    				});	
    				shakeTheWeb({amount : (amount+1), shaker : id, shake : shake } );
    			}

    		
    		}

    		var update = function(params) {
    			var path, radius;
    			path = params.path;
    			
    			


    			if (params.radius) {
    				radius = params.radius;	
    				var top_left = path.bounds.topLeft.y;
    		        var bottom_left = path.bounds.bottomLeft.y;
    		        var calculated_radius = (bottom_left - top_left) / 2;

    				// Scale the copy by 50%:
    				path.scale(radius / calculated_radius);
    				current_radius = calculated_radius;
    			}
    			if (params.x && params.y) {
    				x = params.x;
    				y = params.y;
    		    	//console.log('update');

    		       
    				path.position = new paper.Point(params.x, params.y);
    		        //path.position = new paper.Point(x,y);

    		        var bezier_scale = params.bezier / CELL_BEZIER;
    		        
    		        $.each(lines,function(id,line){
    		        	if (line && line['update']) {
    		        		line.update({bezier_scale : bezier_scale});
    		        	}
    		        });
    			}
    			

    					
    		};

    		var create = function() {

    			creating = true;

    			path = new paper.Path.Circle(new paper.Point(starting_x, starting_y), starting_radius);
    			path.strokeColor     = (looking) ? looking_stroke_color : not_looking_stroke_color;
    			path.fillColor       = (looking) ? looking_fill_color : not_looking_fill_color;
    			path.strokeWidth     = stroke_width;
    			groups.cells.addChild(path);

    			//path.smooth();
    			var line_collection = [];
    			
    			if (connections && connections.length) {
    				$.each(connections,function(i,connection){
                        log('add line');
                        log(id);
                        log(connection);
    					addLine([id, connection]);

    	    			
    				});
    			}


    			
    			var tween = new TWEEN.Tween( { 
    				radius : starting_radius 
    			}).to( { 
    				radius : radius 
    			}, CELL_CREATE_TIME ).easing( TWEEN.Easing.Elastic.Out ).onUpdate( function () {
    				update({
    					path : path, 
    					radius : this.radius
    				}); 
    			}).start();

    			if (target_x && target_y) {
    				var tween_start_args = { x : starting_x, y : starting_y, bezier : CELL_BEZIER};
    				
    				var tween_end_args = { x : target_x, y : target_y, bezier : 0};
    				
    				var tween = new TWEEN.Tween( tween_start_args).to( tween_end_args, CELL_CREATE_TIME )
    				.easing( TWEEN.Easing.Elastic.Out ).delay(CELL_CREATE_TIME/5*Math.random()).onUpdate( function () {
    					var update_params = this;
    					update_params.path = path;
    					update(update_params); 
    				}).start().onComplete(function(){
    					ready = true;
    				});	
    			}
    		
    			
    			path.onMouseEnter = function(event) {
                    log(id);
    				var info_window = $('#info-window-'+id);
    				if (! info_window.length) {
    					infoWindow({ id : id, x: x, y : y, event: event});
    					
    					/*var cell_noise_variance = 2;
    					var random_x = x + (Math.random() * cell_noise_variance) - cell_noise_variance / 2;
    					var random_y = y + (Math.random() * cell_noise_variance) - cell_noise_variance / 2;*/
    					var random_x = x;
    					var random_y = y;
    					var tween = new TWEEN.Tween( { radius : current_radius, x : x, y : y }).to( { radius : radius*CELL_RADIUS_SCALE, x : random_x, y : random_y }, CELL_CREATE_TIME/2 )
    					.easing( TWEEN.Easing.Elastic.Out ).onUpdate( function () {update({path : path, radius : this.radius, x : this.x, y : this.y}); }).start();
                        if (id!= 0) {
                            $('body').css('cursor', 'pointer');    
                        }
    					
    					hovering = true;
    					shakeTheWeb({shake : true});
    				}
    				
    				
    				
    			}
    			path.onMouseLeave = function() {

    				var info_window = $('#info-window-'+id);

    				var tween = new TWEEN.Tween( { radius : current_radius, x : x, y : y }).to( { radius : radius, x : target_x, y : target_y }, CELL_CREATE_TIME/2 )
    				.easing( TWEEN.Easing.Elastic.Out ).onUpdate( function () {update({path : path, radius : this.radius, x : this.x, y : this.y}); }).start();
    				$('body').css('cursor', 'inherit');
    				hovering = false;
    				shakeTheWeb({ shake : false });

    				if (! info_window.length || ! info_window.hasClass('remain')) {
    					

    					clearInfoWindow(id);	
    				}
    				
    			}
    			path.onClick = function (event) {
                    if (id!=0) {
                        var info_window = $('#info-window-'+id);
                        info_window.addClass('remain');
                        expandInfoWindow(info_window,event);
                        $('.info-window').each(function(){
                            
                            if ($(this).attr('id') != 'info-window-'+id) {
                                
                                var this_id = $(this).attr('id').split('-').pop();
                                log(this_id);
                                /*
                                var tween = new TWEEN.Tween( { radius : current_radius, x : x, y : y }).to( { radius : radius, x : target_x, y : target_y }, CELL_CREATE_TIME/2 )
                                .easing( TWEEN.Easing.Elastic.Out ).onUpdate( function () {update({path : path, radius : this.radius, x : this.x, y : this.y}); }).start();
                                $('body').css('cursor', 'inherit');
                                hovering = false;
                                shakeTheWeb({ shake : false });*/

                                clearInfoWindow(this_id);
                            }
                        });
                        //infoWindow();
                    }
    				
    	        }

    					

    		};
    		var onFrame = function(event) {

    			
    			if (creating) {
    				
    				//path.scale(0.5);
    			}
    		};


    		setTimeout(function(){
    			create();
    		},cells.length);
    		

    		var me = {
    			getPath : getPath,
    			getState : getState,
    			getPosition : getPosition,
    			
    			registerLine : registerLine,

    			shake : shake, 

    			onFrame : onFrame,
    			clearInfoWindow : clearInfoWindow,
    			
    			id : id
    		};

    		registerObject(me);
    		return me;
    	};

    	paper.view.onFrame = function(event) {
    		
    	    // Loop through the segments of the path:
    	    
    	    if (objects.length) { 
    	    	for (var i = 0; i <= objects.length; i++) {
    	    		if (objects[i] && objects[i]['onFrame']) { objects[i].onFrame(event); }
    	    	}
    		}
    		groups.lines.moveBelow(groups.cells);
    		
    	    
    	    // Uncomment the following line and run the script again
    	    // to smooth the path:
    	    
    	}
        paper.tool.onMouseDrag = function(event) {
            $('body').css('cursor', 'pointer');
            
            stage.position = new paper.Point(stage.position.x + event.delta.x, stage.position.y + event.delta.y);
            
            $('.info-window').each(function(){
                var top = parseInt($(this).css('top'));
                var left = parseInt($(this).css('left'));
                var new_css = {top : (top + event.delta.y) + 'px', left : (left + event.delta.x) + 'px'};
                log(new_css);
                $(this).css(new_css);
            })
            //log(event);
        };

        paper.tool.onMouseUp = function(event) {
            $('body').css('cursor', 'inherit');
        };

        
        var window_size = {
            width : $(window).width(),
            height : $(window).height()
        };

        $(window).resize(function(){

            var window_width, window_height;

            window_width = $(window).width();
            window_height = $(window).height();
            if (window_width != window_size.width || window_height != window_size.height) {
                stage.position = new paper.Point(
                    stage.position.x + ((window_width - window_size.width)/2), 
                    stage.position.y + ((window_height - window_size.height)/2)
                );

                window_size = { width: window_width, height: window_height};    
            }
            
        });
        



    	var createCells = function(params) {
    		var friends, distance, radius, depth, initial_angle, starting_position, parent;



    		friends = params.friends;
    		distance = params.distance || CELL_DISTANCE;
    		radius = params.radius || CELL_RADIUS;
    		initial_angle = params.initial_angle || INITIAL_ANGLE_OFFSET;
    		depth = params.depth || 1;
    		starting_position = params.starting_position;
    		cell_separation = params.cell_separation || 60;

    		parent = params.parent;
    		

    		if (friends && friends.length) {
    			initial_angle = initial_angle * 180 / Math.PI; // convert to degrees, from radians



    			for (var i = 0; i< friends.length; i++) {
    				var cell = friends[i];

    				cell.children = cell.friends;
    				cell.parent = parent;
    				
    				if (depth<=1) {
    					
    					cell_separation = 360 / friends.length * 1.5;
    					if (cell_separation > 60) { cell_separation = 60; }

    					var angle = 360 / (friends.length) * i + initial_angle; // 360	
    				} else {

    					// this will need to change dynamically, based on how dense the web is
    					var angle = cell_separation / (friends.length) * i + initial_angle; // 360	
    					if (friends.length > 1) {
    						angle -= 15;
    					}
    					

    				}
    				// convert angle to radians
    				angle = angle * Math.PI / 180;
    				
    				
    				cell.x = paper.view.center.x + (distance * depth) * Math.cos(angle) + (Math.random()*CELL_NOISE);
    				cell.y = paper.view.center.y - 100 + (distance * depth) * Math.sin(angle) + (Math.random()*CELL_NOISE);
    				cell.radius = radius;

    				cell.starting_x = starting_position.x;
    				cell.starting_y = starting_position.y;

    				if (! cell.connections) { cell.connections = []; }
    				if (typeof(cell.connections)!='object') {
    					if (typeof(cell.connections) == 'number') {
    						cell.connections = [cell.connections];
    					} else {
    						cell.connections = [];
    					}
    				}
    				
    				cell.connections.push(parent);
    				cell_friends[cell.id] = cell;


    				if (! queued_cells[depth]) { queued_cells[depth] = []; }


    				queued_cells[depth].push(cell);
    				

    				createCells({
    					friends : cell.friends, 
    					distance : distance, 
    					radius: radius, 
    					depth : depth + 1, 
    					initial_angle : angle, 
    					starting_position : starting_position,
    					parent : cell.id,
    					cell_separation : cell_separation
    				});

    			}
    			//


    			
    		}
    		
    	}

        var init = function(friends_to_use) {
            objects = [];
                /*
                *       init
                */ 

                    setInterval(function(){
                        TWEEN.update();
                    },20);


                    // run

                    setTimeout(function(){
                        var center_x = paper.view.center.x;
                        var center_y = paper.view.center.y *0.7;
                        var user = Grapevine.getUser();
                        
                        cell_friends[0] = new Cell({
                            children: friends_to_use, 
                            x : center_x, 
                            y : center_y - 100,
                            radius: CELL_RADIUS*CELL_RADIUS_SCALE, 
                            fill_color : '#6eb3dd', 
                            id: 0, 
                            name: 'You',
                            image : 'http://graph.facebook.com/'+user.id+'/picture?type=large'
                        }); 
                        cells.push(cell_friends[0]);
                        
                        createCells({
                            parent : 0, 
                            friends : friends_to_use, 
                            initial_angle : INITIAL_ANGLE_OFFSET, 
                            starting_position : {
                                x : center_x, 
                                y : center_y,
                            }
                        });

                        
                        var copy_queued_cells = [];
                        $.each(queued_cells,function(i,queue){
                            queue.sort(function() {return 0.5 - Math.random()}) //Array elements now scrambled  
                            $.each(queue, function(j,cell) {
                                copy_queued_cells.push(cell);
                            });
                        });
                        copy_queued_cells.reverse();
                        $.each(copy_queued_cells,function(i,cell){
                            var cell_id = cell.id;
                            cell = new Cell(cell);

                            cells.push(cell);
                            cell_friends[cell_id] = cell;
                        });
                        

                        

                        


                    },200);
        };

        init(friends_no_search);

    		

    }
  });
  return new _view;
});
















