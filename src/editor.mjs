require('babel-register')({
	extensions: [ '.mjs' ],
	presets: [ 'env' ],
	plugins: [
		'transform-class-properties',
		'transform-export-extensions',
	],
});

require('./fontclod');
