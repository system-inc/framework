// This file must be in ES5 for maximum compatibility

// Class
var Transpiler = {};

// Static methods
Transpiler.execute = function(appFile, appDirectory, directoryContainingFramework) {
	//console.log('appFile', appFile, 'appDirectory', appDirectory, 'directoryContainingFramework', directoryContainingFramework);

	// Use Node's Path class
	var Path = require('path');

	// Update the places Node looks to require files
	var Require = require('./node/Require.js');

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
			'dynamic-import-node',
		],
		sourceMaps: 'both',
		ignore: function(fileName) {
			//console.log('fileName', fileName);

			// Ignore node_modules and sql.js
			if(fileName.match('node_modules') !== null || fileName.match('sql.js') !== null) {
				return true;
			}
			else {
				return false;
			}
		},
	});

	// Require the app file
	require(appFile);
};

Transpiler.logCachedTranspiledSourceForPath = function(path) {
	var TranspilerCache = require('babel-register/lib/cache').get()

	TranspilerCache.each(function(key, value) {
		var keyObject = Json.decode(key.substring(0, key.length - 7));
		
		if(keyObject.filename == path) {
			console.log(value.code);
			return false; // break
		}
	});
}

// Export
module.exports = Transpiler;
