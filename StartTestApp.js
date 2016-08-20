// Transpilation
require('babel-register')({
	presets: [
		//'es2015',
		//'stage-0',
	],
	plugins: [
		'transform-es2015-modules-commonjs',
		//'transform-es2015-block-scoping',
		'transform-es2015-parameters',
		'transform-export-extensions',
		'transform-class-properties',
		'transform-async-to-generator',
		'transform-exponentiation-operator',
		'syntax-trailing-function-commas',
	],
	sourceMaps: true,
	//sourceMaps: 'both',
});

require('./TestApp.js');