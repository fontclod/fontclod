export default class Contour(parent) {
	constructor(parent) {
		this.points = [];
		this.parent = parent;
	}

	addPoint() {}

	removePoint() {
		if (this.points.length <= 1) {
			this.parent.removeContour(this);
		}
	}
}
