(function(Fontclod) {
	"use strict";

	var version = 0.2;

	function Clod(c) {
		var named   = {},
		    unicode = {};

		this.data = {
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

		this.glyph = {
			named: named,
			unicode: unicode
		};
	}

	Clod.prototype.serialize   = function(format) {
		if (typeof this._format[format] == 'undefined')
			format = 'clodifle';

		return this._format[format].serialize(this.data);
	};

	Clod.prototype.unserialize = function(format) {
		if (typeof this._format[format] == 'undefined')
			format = 'clodifle';

		return this._format[format].unserialize(this.data);
	};

	Clod.prototype.findGlyph = function(search) {
		if (search[0] == '#') {
			search = search.substr(1);

			if (this.glyphs.unicode.hasOwnProperty(search))
				return this.glyphs.unicode[search];
		} else {
			if (this.glyphs.named.hasOwnProperty(search))
				return this.glyphs.named[search];
		}

		return undefined;
	};

	Clod.prototype.createGlyph = function() {
	};

	Clod.prototype.removeGlyph = function() {
	};

	// to aid in copy()
	Clod.prototype.valueOf = function() {
		return new this.constructor(this);
	};

	Fontclod.Clod = Clod;
})(Fontclod);
