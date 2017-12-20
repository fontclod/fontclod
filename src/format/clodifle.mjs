export default class clodifle {
	static name = 'Clodifle';
	static extension = 'clod';

	static serialze(data) {
		return JSON.stringify(data);
	}

	static unserialize(data) {
		return JSON.parse(data);
	}
}
