import { Undo } from '../util';

export default class Glyph {
	constructor(data) {
		this._history = new Undo();

		this.unicode = data.unicode || -1;
		this.name = data.name || '';
		this.width = data.width || null;
		this.contours = [];
		this.open = !!data.open;
	}

	history() {}
	addContour() {}
	removeContour(contour) {}
}
