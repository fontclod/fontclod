(function(Fontclod) {
	"use strict";

	function Contour(parent) {
		this.points = [];
		this.parent = parent;
	}

	Contour.prototype.addPoint = function() {};

	Contour.prototype.removePoint = function() {
		if (this.points.length <= 1)
			this.parent.removeContour(this);
	};

	Fontclod.Contour = Contour;
})(Fontclod);