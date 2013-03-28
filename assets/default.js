Clod = (function() {
	var f, Clod,
	    version = 0.1;

	Clod = function(c) {
		var named = {}, unicode = {}, clod, dirt, Glyph;
		c = c || {};

		Glyph = function(g, clod) {
			var glyph = {
				unicode:  g.unicode  || -1,
				name:     g.name     || '',
				width:    g.width    || null,
				contours: g.contours || []
			};

			named[glyph.name] = glyph;

			if (glyph.unicode != -1)
				unicode[glyph.unicode] = glyph;

			return glyph;
		};

		clod = {
			format: 'clodifle',
			version: version,

			generator: {
				name:    'Fontclod',
				release: Fontclod.release,
				version: Fontclod.version,
				build:   Fontclod.build
			},

			font: {
				name: c.name || '',

				version: {
					major: (c.version || {}).major || 0,
					minor: (c.version || {}).minor || 0
				},

				family:  c.family  || '',
				style:   c.style   || '',

				width:   c.width   || 400,
				ascent:  c.ascent  || 400,
				descent: c.descent || 100,
				cap:     c.cap     || 0,
				xHeight: c.xHeight || 0,
				angle:   c.angle   || 0,

				glyphs: named
			}
		};

		dirt = {
			data: clod,

			createGlyph: function(glyph) {
				if (!glyph.name || !/^[a-z_.]+$/i.test(glyph.name))
					return false;

				glyph = new Glyph(glyph, clod);

				Fontclod.trigger('glyphadd', glyph);

				return glyph;
			},

			removeGlyph: function(glyph) {
				var del = 0;

				if (named.hasOwnProperty(glyph.name))
					del += +delete named[glyph.name];

				if (glyph.id != -1 && unicode.hasOwnProperty(glyph.id))
					del += +delete unicode[glyph.name];

				if (!!del)
					Fontclod.trigger('glyphremove', glyph);

				return !!del;
			},

			getGlyphByName: function(name) {
				if (!named.hasOwnProperty(name))
					return false;

				return named[name];
			},

			getGlyphByID: function(id) {
				if (!unicode.hasOwnProperty(id))
					return false;

				return unicode[id];
			}
		};

		if (c.font && c.font.glyphs) {
			for (name in c.font.glyphs) {
				if (!c.font.glyphs.hasOwnProperty(name))
					continue;

				dirt.createGlyph(c.font.glyphs[name]);
			}
		}

		return dirt;
	};

	f = function($) { $ = new Clod($); $.constructor = Clod; return $; };
	f.version = version;
	return f;
})();

Fontclod = (function() {
	var clod,
	    version   = 0.0007,
	    build     = 28,
	    glyph     = 's_d_f',
	    events    = {
		    glyphadd: [],
	 	    glyphremove: [],
	 	    selectionadd: [],
	 	    selectionremove: [],
	 	    selectionchange: [],
	 	    load: [],
	 	    save: [],
	 	    undo: [],
	 	    redo: []
	    },
	    selection = {
		    latest: undefined,
		    points: []
	    },
	    undo = {
		    stack: [],
	 	    index: 0
	    },
	    copy = function(original) {
		    if (typeof original != 'object')
			    return original;

		    var copy, prop,
			value = original.valueOf();

		    if (original != value)
			    return value;

		    copy = new original.constructor();

		    for (prop in original) {
			    if (original.hasOwnProperty(prop))
				    copy[prop] = arguments.callee(original[prop]);
		    }

		    return copy;
	    };

	return {
		release: 'alpha',
		version: version,
		build:   build,

		get selection() {
			return {
				get length() {
					return selection.points.length;
				},

				get latest() {
					if (!selection.latest)
						return false;

					return selection.latest;
				},

				clear: function() {
					selection.latest = undefined;
					selection.points = [];
				},

				add: function(c, p, t) {
					var interrupt = false;
					t = (t !== undefined) ? t : 2;
					selection.points.forEach(function(point, i) {
						if (interrupt) return;

						if (point[0] > c || (point[0] == c && point[1] > p) || (point[0] == c && point[1] == p && point[2] < t)) {
							selection.points.splice(i, 0, [c, p, t]);
							interrupt = true;
							return;
						}
					});

					if (!interrupt)
						selection.points.push([c, p, t]);

					selection.latest = [c, p, t];
				},

				remove: function(c, p, t) {
					var index = Fontclod.selection.selected(c, p, t);

					if (index !== false)
						selection.points.splice(index, 1);
				},

				selected: function(c, p, t) {
					var selected = false;
					t = (t !== undefined) ? t : 2;

					selection.points.forEach(function(point, i) {
						if (selected !== false) return;

						if (point[0] == c && point[1] == p && point[2] == t)
							selected = i;
					});

					return selected;
				},

				get points() {
					return selection.points;
				},

				set points(point) {
					Fontclod.selection.clear();
					Fontclod.selection.add(point);
				}
			};
		},

		get clod() {
			if (clod == undefined)
				clod = new Clod();

			return clod;
		},

		get font() {
			return Fontclod.clod.data.font;
		},

		set glyph(g) {
			if (/^[a-z_.]+$/i.test(g))
				glyph = g;

			if (!Fontclod.clod.getGlyphByName(glyph))
				Fontclod.clod.createGlyph({ name: glyph });
		},

		get glyph() {
			return glyph;
		},

		get contours() {
			return Fontclod.clod.getGlyphByName(glyph).contours;
		},

		set contours(contours) {
			Fontclod.clod.getGlyphByName(glyph).contours = contours;
		},

		set undo(item) {
			if (typeof undo[glyph] === 'undefined')
				undo[glyph] = { stack: [], index: 0 };

			if (undo[glyph].stack.length > 200)
				undo[glyph].stack.shift();

			// compare points for similarity
			if (JSON.stringify(undo[glyph].stack[undo[glyph].index]) === JSON.stringify(item))
				return;

			// duplicate points
			undo[glyph].stack.splice(undo[glyph].index + 1, undo[glyph].stack.length - (undo[glyph].index + 1), item.map(function(a) {
				return {
					open: a.open,
					points: a.points.map(function(a) {
						return a.slice();
					})
				};
			}));

			undo[glyph].index = undo[glyph].stack.length - 1;
		},

		get undo() {
			return function(num) {
				if (typeof undo[glyph] === 'undefined')
					undo[glyph] = { stack: [], index: 0 };

				undo[glyph].index -= num || 1;

				if (undo[glyph].index <= 0)
					undo[glyph].index = 0;

				if (undo[glyph].index >= undo[glyph].stack.length - 1)
					undo[glyph].index = undo[glyph].stack.length - 1;

				if (undo[glyph].index < 0 || undo[glyph].stack.length < 1)
					return;

				Fontclod.contours = undo[glyph].stack[undo[glyph].index].map(function(a) {
					return {
						open: a.open,
						points: a.points.map(function(a) {
							return a.slice();
						})
					};
				});
			};
		},

		redo: function() {
			if (undo[glyph].index < undo[glyph].stack.length)
				undo[glyph].index++;
		},

		save: function() {
			return JSON.stringify(Fontclod.clod.data);
		},

		load: function(c) {
			c = JSON.parse(c || '{}');

			if (c.version == 0)
				c = { version: 0.1, font: { glyphs: { 'dirt': { name: 'dirt', contours: c.contours } } } };

			clod = new Clod(c);
			Fontclod.trigger('load');
		},

		bind: function(event, lambda) {
			if (/ /.test(event)) {
				event = event.split(/ /);

				for (var j, i=0; i<event.length; i++) {
					if (event[i].length)
						Fontclod.bind(event[i], lambda);
				}
			}

			if (typeof events[event] == 'undefined' || typeof lambda != 'function')
				return false;

			events[event].unshift(lambda);
			return true;
		},

		trigger: function(event, target) {
			if (typeof events[event] == undefined)
				return false;

			if (typeof target == 'undefined')
				target = Fontclod;

			var _event = {
				type: event,
				target: target
			};

			events[event].forEach(function(lambda) {
				lambda.call(target, _event);
			});

			return true;
		}
	};
})();
	
$(function() {
	if (location.host == 'localhost' || location.host == '10.42.0.1')
		$('#support-us').remove();

	var draw = 0,
	    ctx = $('#drawing')[0].getContext('2d'),

	    mouse = {
		    button: -1,

		    delta: {
			    _x: 0,
			    _y: 0,
			    x: 0,
			    y: 0
		    },

		    _x: 0,
		    _y: 0,

		    drag: {
			    _x: undefined,
			    _y: undefined,
			    _delta: 0,

			    get x() {
				    return mouse.drag._x;
			    },

			    get y() {
				    return mouse.drag._y;
			    },

			    get delta() {
				    return mouse.drag._delta;
			    },

			    start: function() {
				    mouse.drag._x = mouse.x;
				    mouse.drag._y = mouse.y;
			    },

			    get: function() {
				    if (mouse.drag.x === undefined)
					    return false;

				    var dx = mouse.x - mouse.drag.x,
				        dy = mouse.y - mouse.drag.y;

				    return { x: dx, y: dy };
			    },

			    end: function() {
				    var d = mouse.drag.get();

				    mouse.drag._x =
				    mouse.drag._y = undefined;

				    mouse.drag._delta = 0;

				    return d;
			    }
		    },

		    get x() {
			    return mouse._x;
		    },

		    set x(x) {
			    mouse._x = x - Math.floor(origin._x);
		    },

		    get y() {
			    return mouse._y;
		    },

		    set y(y) {
			    mouse._y = window.innerHeight - (Math.floor(origin._y) + y);
		    },

		    event: function(event) {
			    if (typeof event.clientX == undefined)
				    return;

			    var d,
				px = mouse.delta._x,
				py = mouse.delta._y;

			    mouse.delta._x = event.clientX;
			    mouse.delta._y = event.clientY;

			    mouse.delta.x = mouse.delta._x - px;
			    mouse.delta.y = mouse.delta._y - py;

			    mouse.x = mouse.delta._x; 
			    mouse.y = mouse.delta._y;

			    d = mouse.delta;

			    if (mouse.drag.x !== undefined)
				    mouse.drag._delta += Math.sqrt(d.x * d.x + d.y * d.y);
		    }
	    },

	    keyDown = [],

	    options = {
		    style: {
			    contour: {
				    width: 1,
				    color: '#555',
				    fill:  'transparent'
			    },

			    point: {
				    marker: {
					    width: 1,
					    radius: 3,
					    color: '#111',

					    focus: {
						    fill: '#555'
					    }
				    },

				    handle: {
					    right: {
						    width: 1,
						    radius: 6,
						    color: '#dbb',
						    fill: '#fee',

						    focus: {
							    fill: '#888'
						    }
					    },

					    left: {
						    width: 1,
						    radius: 6,
						    color: '#bbf',
						    fill: '#eef',

						    focus: {
							    fill: '#888'
						    }
					    }
				    }
			    }
		    }
	    },

	    origin  = {
		    _width: window.innerWidth,
		    _height: window.innerHeight,

		    _x: (window.innerWidth - Fontclod.font.width) / 2,
		    _y: (window.innerHeight - (Fontclod.font.ascent - Fontclod.font.descent)) / 2,

		    x: function(x) {
			    return Math.floor(origin._x) + x + .5;
		    },

		    y: function(y) {
			    return (window.innerHeight - (Math.floor(origin._y) + y)) + .5;
		    }
	    };


	$('menu[label=Edit] .undo').live('click', function() {
		Fontclod.undo();
		$(window).trigger('canvas_redraw');
	});

	$('menu[label=Edit] .redo').live('click', function() {
		Fontclod.undo(-1);
		$(window).trigger('canvas_redraw');
	});

	$('menu[label=File] .new').live('click', function() {
		Fontclod.load('{}');
		$(window).trigger('canvas_redraw');
	});

	$('menu[label=File] .save').live('click', function() {
		$('.dialog.save').removeAttr('hidden');

		var indent = 0;
		$('.dialog.save textarea').val(
			Fontclod.save()
				.replace(/([{}[\],:])/g, function(m) {
					var tab = new Array(indent + 1).join('\t');
					switch (m) {
						case '{': case '[':
							indent++;
							m = m + '\n\t' + tab;
							break;

						case '}': case ']':
							indent--;
							m = '\n' + tab.substr(1) + m;
							break;

						case ',':
							m = ',\n' + tab;
							break;

						case ':':
							m = ': ';
							break;
					}

					return m;
				})
				.replace(/(\[[^[\]]+\])/g, function(m) {
					return m.replace(/\s+/g, ' ');
				})
		);

		$('.dialog.load').attr('hidden', '');
	});

	$('menu[label=File] .load').live('click', function() {
		$('.dialog.load').removeAttr('hidden');
		$('.dialog.save').attr('hidden', '');
	});

	$('.close-dialog').live('click', function() {
		$(this).parent().attr('hidden', '');
	});

	$('.dialog.load .load').live('click', function() {
		Fontclod.load($('#load-data').val());
		$(window).trigger('canvas_redraw');
		$(this).parent().attr('hidden', '');
	});

	$('#glyphs ul li').live({
		'click': function() {
			var $this = $(this);
			$('#glyphs ul li').removeClass('focus');
			$this.addClass('focus');
			Fontclod.glyph = $this.text();
			$(window).trigger('canvas_redraw');
		},

		'dblclick': function() {
			var $this  = $(this),
			    $input = $('<input/>').val($this.data('glyph'));

			$this.empty().append($input);
			$input.focus();
		}
	});

	$('#glyphs ul li input').live({
		// Gobble click events before they reach the parent
		'dblclick click': function() { return false; },
		'blur keypress': function() {
			var $this   = $(this),
			    $parent = $this.parent(),
			    name    = $this.val(),
			    glyph   = Fontclod.clod.getGlyphByName($parent.data('glyph'));

			if (event.keyCode && event.keyCode != 13)
				return;

			if (!/^[a-z_.]+$/i.test(name) || Fontclod.clod.getGlyphByName(name)) {
				$parent.text($parent.data('glyph'));
				return;
			}

			glyph.name = name;
			Fontclod.clod.createGlyph(glyph);
			console.log($parent.data('glyph'));
			console.log(Fontclod.clod.removeGlyph({ name: $parent.data('glyph'), id: -1 }));

			$parent.text(name).data('glyph', name);
		}
	});

	$('.add-glyph').live('click', function() {
		var name = prompt('Name your glyph!');

		if (name === null || name.length == 0 || !/^[a-z_.]+$/i.test(name))
			return;

		Fontclod.glyph = name;
		$(window).trigger('canvas_redraw');
	});

	$('.delete-glyph').live('click', function() {
		var $focused = $('#glyphs ul li.focus'),
		    $select  = $focused.prev().add($focused.next()).last()
		    glyph    = $focused.text();

		$focused.remove();

		if ($select) {
			$select.addClass('focus');
			Fontclod.glyph = $select.text();
		}

		Fontclod.clod.removeGlyph(Fontclod.clod.getGlyphByName(glyph));

		$(window).trigger('canvas_redraw');
	});

	Fontclod.bind('load glyphadd glyphremove', function() {
		$('#glyphs ul').empty();

		Object.keys(Fontclod.clod.data.font.glyphs).sort().forEach(function(glyph) {
			$('#glyphs ul').append($('<li data-glyph="' + glyph + '"/>').text(glyph));

			if (Fontclod.glyph == glyph)
				$('#glyphs ul li:last').addClass('focus');
		});
	});

	$.getJSON('assets/clodifle.json' + (location.host == 'localhost' ? '?site=fontclod' : ''), function(data) {
		Fontclod.load(JSON.stringify(data));
		$(window).trigger('resize');
	});

	$('#version a').html('&' + Fontclod.release + ';' + Math.round(Fontclod.version * 10000));

	$('#clodifle').val(Fontclod.save()).bind({
		'change keydown': function() {
			var $this = $(this);
			setTimeout(function() {
				Fontclod.load($this.val());
			}, 0);
		},

		'focus': function() {
			$(this).select();
		}
	});

	$(window).bind({
		'contextmenu': function(event) {
			return /^(input|a|textarea)$/i.test(event.target.nodeName);
		},

		'mousemove': function(event) {
			mouse.event(event);

			if (mouse.button == -1 && mouse.drag.delta) {
				origin._x += mouse.delta.x;
				origin._y -= mouse.delta.y;
				mouse.event(event);
				$(this).trigger('canvas_redraw');
			}

			$('#cursor-data').text(Math.floor(mouse.x) + ', ' + Math.floor(mouse.y)).css({
				'top':  event.clientY + 20,
				'left': event.clientX + 8
			});

			if (Fontclod.selection.length && mouse.button == 0 && mouse.drag.delta > 3) {
				var dx, dy,
				    contours = Fontclod.contours,
				    p = Fontclod.selection.latest;

				p = contours[p[0]].points[p[1]].slice(p[2] * 2);

				dx = mouse.x - p[0];
				dy = mouse.y - p[1];

				Fontclod.selection.points.forEach(function(p, i) {
					if ((p[2] == 2) != (Fontclod.selection.latest[2] == 2)) return;

					point = contours[p[0]].points[p[1]];

					contours[p[0]].points[p[1]].splice(
						p[2] * 2, 2,
						point[ p[2] * 2]      + dx,
						point[(p[2] * 2) + 1] + dy
					);

					if (Fontclod.selection.latest[2] == 2) {
						contours[p[0]].points[p[1]].splice(
							0, 4,
							point[0] + dx, point[1] + dy,
							point[2] + dx, point[3] + dy
						);
					}
				});

				$(this).trigger('canvas_redraw');
			}
		},

		'mouseout blur': function(event) {
			$('#cursor-data').css('top', -200);
		},

		'mousedown': function(event) {
			var dx, dy, last, point, contour, target,
			    count     = 0,
			    interrupt = false,
			    radius    = 0,
			    $this     = $(this);

			if (/^(input|textarea|button)$/i.test(event.target.nodeName))
				return true;

			if (/^(input|textarea|button)$/i.test(document.activeElement.nodeName))
				document.activeElement.blur();

			mouse.event(event);
			mouse.button = event.button;

			Fontclod.undo = Fontclod.contours;

			interrupt = false;
			Fontclod.contours.forEach(function(contour, c) {
				if (interrupt) return;

				contour.points.forEach(function(point, p) {
					if (interrupt) return;

					for (t=2; t>=0; t--) {
						if (contour.open && p == 0 && t == 0)
							continue;

						if (contour.open && p == (contour.points.length - 1) && t == 1)
							continue;


						point = contour.points[p].slice(2 * t, 2 + (2 * t));

						dx = point[0] - mouse.x;
						dy = point[1] - mouse.y;

						if (t == 2)
							radius = options.style.point.marker.radius;
						else
							radius = options.style.point.handle[t == 1 ? 'left' : 'right'].radius;


						if (Math.sqrt(dx * dx + dy * dy) < radius) {
							if (event.ctrlKey) {
								target = [c, p, t];
								interrupt = true;
								return false;
							}

							var index = Fontclod.selection.selected(c, p, t);

							mouse.drag.start();

							if (!event.shiftKey && Fontclod.selection.length <= 1)
								Fontclod.selection.clear();

							if (index !== false)
								Fontclod.selection.remove(c, p, t);

							if (!event.shiftKey && index === false)
								Fontclod.selection.clear();

							if (!event.shiftKey || index === false)
								Fontclod.selection.add(c, p, t);
							else
								$this.trigger('mouseup');

							interrupt = true;
							return false;
						}
					}
				});
			});

			if (!event.shiftKey && !event.ctrlKey && !(Math.sqrt(dx * dx + dy * dy) < radius)) {
				Fontclod.selection.clear();
				$this.trigger('mouseup');
			}

			if (event.ctrlKey) {
				interrupt = false, point = [];
				Fontclod.selection.points.forEach(function(p, i) {
					if (interrupt) return;

					if (last && p[2] == 2) {
						interrupt = true;
						point = [];
						last  = [];
					}
				});

				point = Fontclod.selection.latest;
				if (point.length && (point[2] != 2 || !Fontclod.contours[point[0]].open || (point[1] > 0 && point[1] < Fontclod.contours[point[0]].points.length - 1)))
					Fontclod.selection.clear();

				if (target && point && (point[0] != target[0] || point[1] != target[1]) && target[2] == 2 &&
				    (point[1] == 0 || point[1] == Fontclod.contours[point[0]].points.length - 1) &&
				    (target[1] == 0 || target[1] == Fontclod.contours[target[0]].points.length - 1)) {

					if (point[0] == target[0]) {
						Fontclod.contours[target[0]].open = false;
						Fontclod.selection.clear();
					} else {
						contour = [
							Fontclod.contours[point[0]],
							Fontclod.contours[target[0]]
						];

						if (point[1] == 0) {
							contour[0].points = contour[0].points.reverse().map(function(a) {
								return [a[2], a[3], a[0], a[1], a[4], a[5]];
							});
						}

						if (target[1] != 0) {
							contour[1].points = contour[1].points.reverse().map(function(a) {
								return [a[2], a[3], a[0], a[1], a[4], a[5]];
							});
						}

						contour[0].points = contour[0].points.concat(contour[1].points.splice(0));

						Fontclod.contours.splice(target[0], 1);
						Fontclod.selection.clear();
					}
				} else {
					if (!Fontclod.selection.length || !Fontclod.contours.length) {
						Fontclod.selection.add(Fontclod.contours.length, 0, 2);

						Fontclod.contours.push({
							open: true,
							points: []
						});

						point = Fontclod.selection.latest;
					}

					contour = Fontclod.contours[point[0]];

					if (Fontclod.selection.length == 1) {
						if (point[1] != 0)
							point[1]++;

						contour.points[point[1] ? 'push' : 'unshift']([
							mouse.x, mouse.y,
							mouse.x, mouse.y,
							mouse.x, mouse.y
						]);

						Fontclod.selection.clear();
						Fontclod.selection.add(point[0], point[1], 2);
					}

					mouse.drag.start();
				}
			}

			$this.trigger('canvas_redraw');

			return false;
		},

		'mouseup': function(event) {
			if (!/^(input|textarea|button)$/i.test(event.target.nodeName))
				Fontclod.undo = Fontclod.contours;

			mouse.drag.end();

			if (mouse.button == -1)
				return true;

			mouse.button = -1;

			$('#clodifle').val(Fontclod.save());

			return false;
		},

		'keydown': function(event) {
			if (/^(input|textarea|button)$/i.test(event.target.nodeName))
				return true;

			if (!keyDown[event.keyCode])
				Fontclod.undo = Fontclod.contours;

			keyDown[event.keyCode] = true;

			switch (event.keyCode) {
				case 8: // backspace
					var offset = [], q = [], end, contours = Fontclod.contours, selection = Fontclod.selection, contour;

					if (selection.length == 1 && selection.points[0][2] == 2)
						q = selection.points[0];

					selection.points.reverse().forEach(function(p) {
						if ((contour = contours[p[0]]) === undefined)
							return;

						if (p[2] != 2) {
							point = contour.points[p[1]];

							contour.points[p[1]].splice(
								p[2] * 2, 2,
								point[4], point[5]
							);
							return;
						}

						end = contour.points.splice(p[1] + (offset[p[0]] || 0));
						end.shift();

						if (!contour.open) {
							offset[p[0]] = end.length;

							contour.points = end.concat(contour.points);
							contour.open   = true;

							if (q.length) q[1] = 0;

							return;
						}

						if (!contour.points.length) {
							offset[p[0]]++;

							if (end.length) {
								contour.points = end;
								return;
							}

							contours.splice(p[0], 1);
							offset.splice(p[0], 1);

							if (q[0] == p[0])
								q = [];

							return;
						}

						if (end.length) {
							contours.push({ open: true, points: end });

							if (q.length)
								q = [contours.length - 1, 0, 2];

							return;
						}

						q[1]--;
					});

					selection.clear();

					if (q.length)
						selection.add(q[0], q[1]);

					break;

				case 27: // escape
					Fontclod.selection.clear();
					break;

				case 32: // space
					mouse.drag.start();
					return;
					break;

				// left       up    right     down
				case 37: case 38: case 39: case 40:
					var dx = 0, dy = 0,
					    contours = Fontclod.contours;

					switch (event.keyCode) {
						case 37: dx = -1; break;
						case 38: dy = 1;  break;
						case 39: dx = 1;  break;
						case 40: dy = -1; break;
					}

					if (event.shiftKey) {
						dx = dx * 10;
						dy = dy * 10;
					}

					Fontclod.selection.points.forEach(function(p, i) {
						if ((p[2] == 2) != (Fontclod.selection.latest[2] == 2)) return;

						point = contours[p[0]].points[p[1]];

						contours[p[0]].points[p[1]].splice(
							p[2] * 2, 2,
							point[ p[2] * 2]      + dx,
							point[(p[2] * 2) + 1] + dy
						);

						if (Fontclod.selection.latest[2] == 2) {
							contours[p[0]].points[p[1]].splice(
								0, 4,
								point[0] + dx, point[1] + dy,
								point[2] + dx, point[3] + dy
							);
						}
					});
					break;

				case 90: // z
					if (event.ctrlKey) {
						if (!event.shiftKey)
							Fontclod.undo();
						else
							Fontclod.undo(-1);

						Fontclod.selection.clear();
					}

					break;

				default:
					if (location.host == 'localhost')
						console.log(event.keyCode);

					return true;
					break;
			}

			$(this).trigger('canvas_redraw');

			return false;
		},

		'keyup': function(event) {
			if (/^(input|textarea|button)$/i.test(event.target.nodeName))
				return true;

			delete keyDown[event.keyCode];

			if (!event.ctrlKey)
				Fontclod.undo = Fontclod.contours;

			if (mouse.button == -1)
				mouse.drag.end();

			$('#clodifle').val(Fontclod.save());

			return false;
		},

		'resize': function() {
			$('#drawing').attr({
				width: window.innerWidth,
				height: window.innerHeight
			});

			origin._x += (window.innerWidth  - origin._width)  / 2;
			origin._y += (window.innerHeight - origin._height) / 2;

			origin._width  = window.innerWidth;
			origin._height = window.innerHeight;

			$(this).trigger('canvas_redraw');
		},

		'canvas_redraw': function() {
			draw++;
			setTimeout(function() {
				if (--draw > 0) return;

				ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

				ctx.save();

				ctx.lineCap     = 'butt';
				ctx.lineJoin    = 'bevel';

				(Fontclod.contours || []).map(function(contour) {
					return {
						open: contour.open,
						points: contour.points.map(function(p) {
							return [
								origin.x(p[0]), origin.y(p[1]),
								origin.x(p[2]), origin.y(p[3]),
								origin.x(p[4]), origin.y(p[5])
							];
						})
					};
				}).forEach(function(contour, c) {
					var last = contour.points[contour.open ? 0 : contour.points.length - 1];

					contour.points.forEach(function(point, p) {
						// contours
						if (!contour.open || p != 0) {
							ctx.beginPath();
							ctx.lineWidth   = options.style.contour.width;
							ctx.strokeStyle = options.style.contour.color;
							ctx.globalCompositeOperation = 'source-over';

							ctx.moveTo(last[4], last[5]);
							ctx.bezierCurveTo(
								last[2],  last[3],
								point[0], point[1],
								point[4], point[5]
							);

							ctx.stroke();

							last = point;
						}

						// handles, point markers
						ctx.globalCompositeOperation = 'destination-over';

						// right handle
						if (!contour.open || p != 0) {
							ctx.beginPath();
							ctx.lineWidth   = options.style.point.handle.right.width;
							ctx.strokeStyle = options.style.point.handle.right.color;
							ctx.fillStyle   = options.style.point.handle.right.fill;

							ctx.moveTo(point[4], point[5]);
							ctx.lineTo(point[0], point[1]);

							ctx.moveTo(point[0] + options.style.point.handle.right.radius, point[1]);
							ctx.arc(point[0], point[1], options.style.point.handle.right.radius, 0, Math.PI * 2, false);
							ctx.stroke();

							if (Fontclod.selection.selected(c, p, 0) !== false)
								ctx.fill();
						}

						// left handle
						if (!contour.open || p != (contour.points.length - 1)) {
							ctx.beginPath();
							ctx.lineWidth   = options.style.point.handle.left.width;
							ctx.strokeStyle = options.style.point.handle.left.color;
							ctx.fillStyle   = options.style.point.handle.left.fill;

							ctx.moveTo(point[4], point[5]);
							ctx.lineTo(point[2], point[3]);

							ctx.moveTo(point[2] + options.style.point.handle.left.radius, point[3]);
							ctx.arc(point[2], point[3], options.style.point.handle.left.radius, 0, Math.PI * 2, false);
							ctx.stroke();

							if (Fontclod.selection.selected(c, p, 1) !== false)
								ctx.fill();
						}

						// point marker
						ctx.beginPath();
						ctx.globalCompositeOperation = 'source-over';
						ctx.lineWidth   = options.style.point.marker.width;
						ctx.strokeStyle = options.style.point.marker.color;
						ctx.fillStyle   = options.style.point.marker.focus.fill;

						ctx.moveTo(point[4] + options.style.point.marker.radius, point[5]);
						ctx.arc(point[4], point[5], options.style.point.marker.radius, 0, Math.PI * 2, false);
						ctx.stroke();

						if (Fontclod.selection.selected(c, p, 2) !== false)
							ctx.fill();
					});
				});

				ctx.globalCompositeOperation = 'destination-over';
				ctx.strokeStyle = '#ccc';

				ctx.beginPath();

				ctx.moveTo(origin.x(0), 0);
				ctx.lineTo(origin.x(0), window.innerHeight);

				ctx.moveTo(origin.x(Fontclod.font.width), 0);
				ctx.lineTo(origin.x(Fontclod.font.width), window.innerHeight);

				ctx.moveTo(0                , origin.y(0));
				ctx.lineTo(window.innerWidth, origin.y(0));

				ctx.moveTo(0                , origin.y(Fontclod.font.ascent));
				ctx.lineTo(window.innerWidth, origin.y(Fontclod.font.ascent));

				ctx.moveTo(0                , origin.y(-Fontclod.font.descent));
				ctx.lineTo(window.innerWidth, origin.y(-Fontclod.font.descent));

				ctx.closePath();
				ctx.stroke();

				ctx.restore();
			}, 0);
		}
	}).trigger('resize');
});
