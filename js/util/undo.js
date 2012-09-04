(function(Fontclod) {
	"use strict";

	function Undo(options) {
		options = options || {};
		this.stack  = options.stack || [];
		this._index = options.index || 0;
		this._data  = options.data  || {};
	}

	// Undo.step(1) Undo.step(-10)
	Undo.prototype.step = function(n) {
		this._index = Math.max(0, Math.min(this._index + n, this.data.length));
	};

	// Undo.seek(index)
	Undo.prototype.seek = function(i) {
		this._index = i;
	};

	Undo.prototype.push = function(data) {
		var diff = this.diff(data);

		if (Object.keys(diff).length)
			this.stack.push(diff);
	};

	Undo.prototype.diff = function(data) {
		var i, key,
		    diff = {},
		    keys = Object.keys(data);

		for (i=0, key=keys[0]; i<keys.length; key=keys[++i]) {
			if (this._data[key] != data[key])
				diff[key] = data[key];
		}

		this._data = data;

		return diff;
	};

	Fontclod.Undo = Undo;
})(Fontclod);
