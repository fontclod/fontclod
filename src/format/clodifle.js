export class clodifle {
	static extension = 'clod';

	static serialze(data) {
		return JSON.stringify(data);
	}

	static unserialize(data) {
		return JSON.parse(data);
	}
}
