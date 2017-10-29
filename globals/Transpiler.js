// This file must be in ES5 for maximum compatibility

// Class
var Transpiler = {};

// Static methods
Transpiler.execute = function(appFile, appDirectory, directoryContainingFramework) {
	//console.log('appFile', appFile, 'appDirectory', appDirectory, 'directoryContainingFramework', directoryContainingFramework);

	// Use Node's Path class
	var Path = require('path');

	// Update the places Node looks to require files
	var Require = require('./Require.js');

	// Make import and require statements check the app directory
	Require.addRequirePath(appDirectory);

	// Make import and require statements check the directory containing Framework
	Require.addRequirePath(directoryContainingFramework);

	// Make import and require statements check the app's library directory
	Require.addRequirePath(Path.join(appDirectory, 'libraries/')); // Make require() check the libraries directory

	// Make import and require statements check the Framework's node_modules directory
	Require.addRequirePath(Path.join(directoryContainingFramework, 'framework/node_modules/'));

	// Disable the Babel cache for debugging
	//process.env.BABEL_DISABLE_CACHE = 1;

	// Include the Babel polyfill when generator support is not available
	//require('babel-polyfill');

	// Integrate transpilation with import statements
	require('babel-register')({
		presets: [
		],
		plugins: [
			'transform-class-properties',
			'transform-es2015-modules-commonjs',
		],
		sourceMaps: 'both',
	});

	// Require the app file
	require(appFile);
};

// Export
module.exports = Transpiler;
