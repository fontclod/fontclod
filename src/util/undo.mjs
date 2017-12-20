export default class Undo {
	constructor(options = {}) {
		this.stack  = options.stack || [];
		this.index = options.index || 0;
		this.data  = options.data  || {};
	}

	/**
	 * Seek to a position in the undo stack at offset
	 * 
	 * @example
	 * Undo.step(1) // step forward by one in undo history
	 * Undo.step(-10) // step backward by ten in undo history
	 *
	 * @param {number} count  Relative number of steps to move in the undo stack
	 */
	step(n) {
		this.index = Math.max(0, Math.min(this._index + n, this.data.length));
	}

	/**
	 * Push data onto the undo stack
	 *
	 * @param {any} data  Data to be pushed onto the undo stack
	 */
	push(data) {
		var diff = this.diff(data);

		if (Object.keys(diff).length) {
			this.stack.push(diff);
		}
	}

	diff(data) {
		var i, key,
		    diff = {},
		    keys = Object.keys(data);

		for (i=0, key=keys[0]; i<keys.length; key=keys[++i]) {
			if (this._data[key] != data[key])
				diff[key] = data[key];
		}

		this.data = data;

		return diff;
	}
}
