
$('document').ready(function(){
	paper.setup($('canvas').attr('id')); 
	setInterval(function(){
		view = paper.View._viewsById[$('canvas').attr('id')];
		if (view) { 
			log(view);
			view.draw(true); 
		}
	},1);

	var friends = [
				{
					id : 1,
					name : 'Kevin Scott',
					image : 'https://sphotos-a.xx.fbcdn.net/hphotos-ash4/304827_952344262311_105235805_n.jpg',
					friends : [
						{
							id : 2,
							name : 'Molly Shannon',
							image : '',
							friends : [
								{
									id : 3,
									name: 'Kirsten Wiig',
									image: ''
								}
							]
						},
						{ 
							id : 10,
							name : 'Horatio',
							connections : [11]
						},
						{
							id : 11,
							name : 'Thomas Jefferson',
							connections : [10]
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
									image : ''
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
							name : 'Mickey Mouse',
							image : ''
						}
					]
				},
				{
					id : 8,
					name : 'Peter Griffin',

				},

				{
					id : 9,
					name : 'Thoreau'
				}
				];
	// defined vars are uppercase
	// classes start with uppercase letters
	// variables have underscores
	// functions are camel case



	var DEBUG, CELL_CREATE_TIME, CELL_DISTANCE, CELL_RADIUS, INITIAL_ANGLE_OFFSET, 
		CELL_DELAY_CREATE_TIME, CELL_RADIUS_SCALE, CELL_NOISE, CELL_BEZIER,
		CELL_SHAKE;
	var Cell, objects, cells, queued_cells, cell_friends, lines, bottom_cell, groups, stage, info_window;


	// init
	DEBUG = true;
	CELL_CREATE_TIME = 1000;
	CELL_DELAY_CREATE_TIME = 40;
	CELL_DISTANCE = 150;
	CELL_RADIUS = 10;
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


	groups = {cells : (new Group()), lines : (new Group()), info_windows : (new Group()), content : (new Group()) };
	stage = new Group([groups.cells, groups.lines, groups.info_windows, groups.content]);


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

		cell_a = cell_friends[cells.shift()];
		cell_b = cell_friends[cells.shift()];



		
		line = new Path();
		line.strokeColor = 'black';

		cell_a_position = cell_a.getPosition();
		cell_b_position = cell_b.getPosition();

		line.add(new Point(cell_a_position.x, cell_a_position.y));	
		line.add(new Point(cell_b_position.x, cell_b_position.y));	
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
		
		var x, y, starting_x, starting_y, target_x, target_y, radius, stroke_color, stroke_width, fill_color; 
		var _this, id, name, lines, connections, children, parent; 
		var cell_lines, current_radius, info_window;

		var path, creating, info_window_padding, hovering, shaking, ready;

		_this = this;

		children = params.children;
		parent = params.parent;
		

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
		stroke_color = params.stroke_color || '#333';
		fill_color = params.fill_color || '#FFF';
		stroke_width = params.stroke_width || 1;
		info_window_padding = 20;

		name = params.name;

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

		var registerLine = function(line) {
			lines.push(line);
		}



		var infoWindow = function(point) {
			var top, left, info_window, amount_to_move, time_to_create;
			info_window = $('<div class="info-window"></div>');
			$('body').append(info_window);

			amount_to_move = 8;
			time_to_create = 400;
			top = point.y - info_window.height();
			left = point.x - (info_window.width()/2);
			info_window.addClass('show');
			info_window.stop().css({display : 'block', 'top' : top + amount_to_move, 'left' : left}).animate({opacity : 'show', top: top},
				{ duration :time_to_create, easing: 'easeOutQuad'});
			info_window.html('<img src="http://graph.facebook.com/'+Math.round(Math.random()*10000000 + 1000000)+'/picture" /><h1>'+name+'</h1>');

			
			/*
			if (! info_window) {

				info_window = new Path();
				info_window.strokeColor = 'black';
				info_window.fillColor = 'white';
				info_window.strokeWidth = 1;
				info_window_arrow_width = 11;

				info_window.add(new Point(x, y));
				info_window.add(new Point(x-(info_window_arrow_width*2), y-50));	
				info_window.add(new Point(x-info_window_arrow_width-50, y-50));	
				info_window.add(new Point(x-info_window_arrow_width-50, y-50-100));	
				info_window.add(new Point(x-info_window_arrow_width+150, y-50-100));	
				info_window.add(new Point(x-info_window_arrow_width+150, y-50));	
				info_window.add(new Point(x, y-50));	
				info_window.add(new Point(x, y));	

				
				var raster = new Raster('image-1');

				// Move the raster to the center of the view
				raster.position = new Point(x-info_window_arrow_width, y-100);
				raster.scale(0.1);
				groups.content.addChild(raster);
				
				var text = new PointText(new Point(x-info_window_arrow_width + 50, y-100-30));
				

				// Set the content of the text item:
				text.content = name;
				text.characterStyle = {
				    fontSize: 12,
				    font : 'Lucida Grande',
				    fillColor: 'black',
				};
				text.moveAbove(groups.info_windows);


				groups.info_windows.addChild(info_window)
			}
			info_window.opacity = 1.0;*/
		}

		var clearInfoWindow = function() {
			var info_window, top;
			info_window = $('.info-window');
			top = parseInt(info_window.css('top'));
			
			info_window.animate({top: top-10, opacity : 'hide'},function(){
				$(this).remove();
			});
			log('here');
			return;
			
		}

		
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
				cell_friends[connection].shake({shake : shake, amount : amount, shaker : id});
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

		       
				path.position = new Point(params.x, params.y);
		        //path.position = new Point(x,y);

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

			path = new Path.Circle(new Point(starting_x, starting_y), starting_radius);
			path.strokeColor = stroke_color;
			path.fillColor = fill_color;
			path.strokeWidth = stroke_width;
			groups.cells.addChild(path);

			//path.smooth();
			var line_collection = [];
			
			if (connections && connections.length) {
				$.each(connections,function(i,connection){
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
				infoWindow({ x: x, y : y});
				
				/*var cell_noise_variance = 2;
				var random_x = x + (Math.random() * cell_noise_variance) - cell_noise_variance / 2;
				var random_y = y + (Math.random() * cell_noise_variance) - cell_noise_variance / 2;*/
				var random_x = x;
				var random_y = y;
				var tween = new TWEEN.Tween( { radius : current_radius, x : x, y : y }).to( { radius : radius*CELL_RADIUS_SCALE, x : random_x, y : random_y }, CELL_CREATE_TIME/2 )
				.easing( TWEEN.Easing.Elastic.Out ).onUpdate( function () {update({path : path, radius : this.radius, x : this.x, y : this.y}); }).start();
				$('body').css('cursor', 'pointer');
				hovering = true;
				shakeTheWeb({shake : true});
				
				
			}
			path.onMouseLeave = function() {
			
				var tween = new TWEEN.Tween( { radius : current_radius, x : x, y : y }).to( { radius : radius, x : target_x, y : target_y }, CELL_CREATE_TIME/2 )
				.easing( TWEEN.Easing.Elastic.Out ).onUpdate( function () {update({path : path, radius : this.radius, x : this.x, y : this.y}); }).start();
				$('body').css('cursor', 'inherit');
				hovering = false;
				shakeTheWeb({ shake : false });

				clearInfoWindow();
			}
			path.onClick = function () {
				//infoWindow();
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

	function onFrame(event) {
	    // Loop through the segments of the path:
	    
	    if (objects.length) { 
	    	for (var i = 0; i <= objects.length; i++) {
	    		if (objects[i] && objects[i]['onFrame']) { objects[i].onFrame(event); }
	    	}
		}
		groups.lines.moveBelow(groups.cells);
		groups.info_windows.moveAbove(groups.cells);
	    
	    // Uncomment the following line and run the script again
	    // to smooth the path:
	    
	}



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
				
				
				cell.x = view.center.x + (distance * depth) * Math.cos(angle) + (Math.random()*CELL_NOISE);
				cell.y = view.center.y + (distance * depth) * Math.sin(angle) + (Math.random()*CELL_NOISE);
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


	/*
	* 		init
	*/ 

		setInterval(function(){
			TWEEN.update();
		},20);


		// run

		setTimeout(function(){
			

			cell_friends[0] = new Cell({children: friends, x : view.center.x, y : view.center.y, radius: 12, fill_color : '#6eb3dd', id: 0, name: 'You'});	
			cells.push(cell_friends[0]);
			createCells({parent : 0, friends : friends, initial_angle : INITIAL_ANGLE_OFFSET, starting_position : {x : view.center.x, y : view.center.y}});

			
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

	function onMouseDrag(event) {
		/*
		var hovering = false;
		
		$.each(cells,function(i,cell){
			
			if (cell.getState() == 'hovering') { 
				hovering = true;
			}
		});
		if (! hovering) {
			log(event.point);	

		}*/
		$('body').css('cursor', 'pointer');
		stage.position = new Point(stage.position.x + event.delta.x, stage.position.y + event.delta.y);
	    
	}	
	function onMouseUp(event) {
		$('body').css('cursor', 'inherit');
	}

});



