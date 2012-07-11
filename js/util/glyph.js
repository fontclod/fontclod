(function(Fontclod) {
	"use strict";

	function Glyph(data) {
		this._history = new Fontclod.Undo();

		this.unicode = data.unicode || -1;
		this.name = data.name || '';
		this.width = data.width || null;
		this.contours = [];
		this.open = !!data.open;
	}

	Glyph.prototype.history = function() {};
	Glyph.prototype.addContour = function() {};
	Glyph.prototype.removeContour = function(contour) {};

	Fontclod.Glyph = Glyph;
})(Fontclod);