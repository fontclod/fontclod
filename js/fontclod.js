Fontclod = (function() {
	"use strict";

	var version = 0.14,
	    build   = 79,
	    release = 'alpha';

	function Fontclod() {
		var glyph, clod;

		this.options = {};
		this.options.editable = true;
		this.options.glyph = {
			regex: /^[a-z_]+(?:\.[a-z0-9]+)?$/
		};

		this.__defineGetter__('build',   function() { return build; });
		this.__defineGetter__('version', function() { return version; });
		this.__defineGetter__('release', function() { return release; });

		this.__defineGetter__('glyph', function() { return glyph; });
		this.__defineSetter__('glyph', function(val) {
			if (/^[a-z_]+(?:\.[a-z0-9]+)?$/i.test(val))
				glyph = val;

			if (!Fontclod.clod.glyph.find(glyph))
				Fontclod.clod.glyph.create({ name: glyph });
		});

		this._stack = new Undo();
		this._selection = new Selection();

		this._events = {};
	}


	// Fontclod.load('file.ext'[, 'type'])
	Fontclod.prototype.load = function() {};

	// Fontclod.save('file.ext'[, 'type'])
	Fontclod.prototype.save = function() {};


	// Fontclod.on('event[ event]', cb);
	Fontclod.prototype.on = function(events, cb) {
		events = events.split(/\s+/g);

		if (events.length <= 1) {
			if (Object.hasOwnProperty.call(this._events, events[0]))
				this._events[events[0]].push(cb);
		} else {
			for (var i=0; i<events.length; i++)
				this.on(events[i], cb);
		}

		return this;
	};

	// Fontclod.emit('event', args);
	Fontclod.prototype.emit = function(event, args) {
		if (Object.hasOwnProperty.call(this._events, event))
			this._events.apply(this, args);
	};


	// Fontclod.add('type'[, options]);
	Fontclod.prototype.add = function(type, options) {
		if (Object.hasOwnProperty.call(this.add.type, type) &&
		    typeof this.add.type[type] == 'function')
			return this.add.type[type].call(this, options || {});
	};

	Fontclod.prototype.add.type = {};


	Fontclod.prototype.undo = function() {
	};

	Fontclod.prototype.redo = function() {
	};


	return Fontclod;
})();
