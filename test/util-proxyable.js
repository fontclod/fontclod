import { Proxyable } from '../src/util';

describe('Proxyable', () => {
	it('should create a proxy', () => {
		let proxy = new class extends Proxyable {};
		Object.is(proxy, Proxy);
	});

	it('should call __get when a property is requested', done => {
		let proxy = new class extends Proxyable {
			__get() {
				done();
			}
		};

		typeof proxy.foo;
	});

	it('should call __set when a property is written', done => {
		let proxy = new class extends Proxyable {
			__set() {
				done();
			}
		};

		proxy.foo = 'bar';
	});
});
