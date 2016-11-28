require('app-module-path').addPath(__dirname);
require('app-module-path').addPath(require('path').join(__dirname, '../../'));

// Disable the Babel cache for debugging
//process.env.BABEL_DISABLE_CACHE = 1;

// Include the Babel polyfill when generator support is not available
//require('babel-polyfill');

// Integrate transpilation with import statements
require('babel-register')({
	presets: [
		//'latest',
		//'stage-0',
	],
	plugins: [
		'transform-class-properties',
		'transform-es2015-modules-commonjs',
	],
	sourceMaps: 'both',
});

require('FrameworkApp.js');
