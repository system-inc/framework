// Transpilation
require('babel-register')({
	presets: [
		'es2015',
		'stage-0',
	],
	sourceMaps: true,
});

require('./Framework.js');

console.log(Node);