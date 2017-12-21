import format from '../format';

export class Clod {
	constructor(c = {}) {
		this.glyph = {
			named: {},
			unicode: {}
		};

		this.data = {
			format: 'clodifle',
			version: Fontclod.version,

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

				glyphs: this.glyph.named
			}
		};
	}

	serialize(format='clodifle') {
		if (typeof format[format] == 'undefined')
			format = 'clodifle';

		return format[format].serialize(this.data);
	}

	unserialize(data, format) {
		if (typeof format[format] == 'undefined')
			format = 'clodifle';

		var data   = format[format].unserialize(data),
		    glyphs = data.font.glyphs;

		this.glyph = {
			named: {},
			unicode: {}
		};

		this.data.font = data.font;
		this.data.font.glyphs = this.glyph.named;
	}

	findGlyph(search) {
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

	createGlyph() {
	};

	removeGlyph() {
	};

	// to aid in copy()
	valueOf() {
		return new this.constructor(this);
	};
}
