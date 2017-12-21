import { Clod, Undo, Selection } from './util';
import { Widget } from './plugin';
import EventEmitter from 'events';

export default class Fontclod extends EventEmitter {
	static version = '0.14.0';
	static release = 'alpha';

	/**
	 * @constructor
	 * @param {Object} [options]  Options object
	 * @param {Boolean} [options.editable=true]  Whether font editing should be enabled or not
	 * @param {Object} [options.glyph]
	 * @param {RegEx} [options.glyph.regex]  Glyph name regex
	 */
	constructor(options = {}) {
		super();

		this.options = {};
		this.options.editable = true;
		this.options.glyph = {
			regex: /^[a-z_]+(?:\.[a-z0-9]+)?$/
		};

		this._stack = new Undo();
		this._selection = new Selection();

		this.__defineGetter__('glyph', function() { return glyph; });
		this.__defineSetter__('glyph', (val) => {
			if (/^[a-z_]+(?:\.[a-z0-9]+)?$/i.test(val))
				glyph = val;

			if (!this.clod.glyph.find(glyph))
				this.clod.glyph.create({ name: glyph });
		});
	}

	get glyph() {
		//if (!this.options.glyph.regex.test(val))
	}

	/**
	 * Load a font file
	 *
	 * @example
	 * Fontclod.load('file.ext'[, 'type'])
	 *
	 * @param {string} filename  Path to file to load
	 * @param {string} [filetype='clod']  Filetype
	 */
	load(filename, filetype='clod') {}

	/**
	 * Save a font file
	 *
	 * @example
	 * Fontclod.save('file.ext'[, 'type'])
	 *
	 * @param {string} filename  Path to file to save
	 * @param {string} [filetype='clod']  Filetype
	 */
	save(filename, filetype='clod') {}


	// Fontclod.add('type'[, options]);
	add(type, options) {
		if (Object.hasOwnProperty.call(this.add.type, type) &&
		    typeof this.add.type[type] == 'function')
			return this.add.type[type].call(this, options || {});
	};
}
