'use strict';

import Clod from 'util/clod.mjs';
import Undo from 'util/undo.mjs';
import Selection from 'util/selection.mjs';
import EventEmitter from 'events';


/**
 * @constructor
 */
export default class Fontclod extends EventEmitter {
	const version = '0.14.0';
	const release = 'alpha';

	constructor(options = {}) {
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

			if (!that.clod.glyph.find(glyph))
				this.clod.glyph.create({ name: glyph });
		});
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
