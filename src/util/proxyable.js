export class Proxyable {
	constructor() {
		return new Proxy(this, {
			set: this.__set,
			get: this.__get,
		});
	}
}
