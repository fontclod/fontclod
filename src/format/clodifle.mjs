(function(Fontclod) {
	"use strict";

	Fontclod.Clod.format.clodifle = {
		name: 'Clodifle',
		extension: 'clod',

		serialize: function(data) {
			return JSON.stringify(data);
		},

		unserialize: function(data) {
			return JSON.parse(data);
		}
	};
})(Fontclod);
