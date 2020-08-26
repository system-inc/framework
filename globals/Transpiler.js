/*
	This file must be in ES5. It executes a Framework app as if the
	all of the features I want to be in Node are ready.

	We need to use this file as is until it is possible to customize
	import paths. As of right now import paths cannot be aliased,
	so I would also have to do import '../../../', instead of
	import 'framework/Class.js' or import 'app/Class.js'

	My function at Require.addRequirePath handles this, but does not work
	with ES modules.

	At some point I will be able to implement a custom loader and runtime
	which will allow my to do these imports.

	https://github.com/nodejs/help/issues/2831
*/

// Class
var Transpiler = {};

// Static methods
Transpiler.execute = function(appFile, appPath, frameworkPath) {
	//console.log('appFile', appFile, 'appPath', appPath, 'frameworkPath', frameworkPath);

	// Use Node's Path class
	var Path = require('path');

	// Update the places Node looks to require files
	var Require = require('./node/Require.js');

	// Make import and require statements check the app directory
	Require.addRequirePath(appPath);

	// Make import and require statements check the directory containing Framework
	Require.addRequirePath(frameworkPath);

	// Make import and require statements check the app's library directory
	Require.addRequirePath(Path.join(appPath, 'libraries/')); // Make require() check the libraries directory

	// Make import and require statements check the Framework's node_modules directory
	Require.addRequirePath(Path.join(frameworkPath, 'framework/node_modules/'));

	// Disable the Babel cache for debugging
	//process.env.BABEL_DISABLE_CACHE = 1;

	// Integrate transpilation with import statements
	require('@babel/register')({
		plugins: [
			'@babel/plugin-proposal-class-properties',
			'@babel/plugin-transform-modules-commonjs',
			'@babel/plugin-syntax-dynamic-import',
		],
		sourceMaps: 'both',
		ignore: [
			function(fileName) {
				//console.log('fileName', fileName);

				// Ignore node_modules and sql.js
				if(fileName.match('node_modules') !== null || fileName.match('sql.js') !== null) {
					return true;
				}
				else {
					return false;
				}
			},
		],
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
