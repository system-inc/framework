// Disable the Babel cache for debugging
process.env.BABEL_DISABLE_CACHE = 1;

// Include the Babel polyfill when generator support is not available
require('babel-polyfill');

// Integrate transpilation with import statements
require('babel-register')({
	presets: [
		'es2015',
		'stage-0',
	],
	plugins: [
		//// Import and export
		//'transform-es2015-modules-commonjs',
		//'transform-export-extensions',

		//// let
		//'transform-es2015-block-scoping',

		//// Default parameters
		//'transform-es2015-parameters',

		//// Trailing commas in function arguments
		//'syntax-trailing-function-commas',

		//// Class properties
		//'transform-class-properties',

		//// 3**3 == 27
		//'transform-exponentiation-operator',

		//// async await
		//'transform-async-to-generator',
	],
	sourceMaps: true,
});

require('./FrameworkCommandLineApp.js');
