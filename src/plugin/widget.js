import { Plugin, PluginModes as Modes  } from '../util';

export class Widget extends Plugin {
	static mode = Modes.ADDABLE;

	constructor() {
		super();
	}
}
