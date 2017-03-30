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
	// Files to not transpile
	ignore: function(path) {
		var ignore = false;
		
		if(
			path.match(/node_modules/) || // Do not transpile node_modules
			path.match(/system.*libraries.*/) // Do not transpile files in libraries folders
		) {
			//console.log(path);
			ignore = true;
		}

		return ignore;
	},
});

try {
	require('FrameworkApp.js');
}
catch(error) {
	console.error(error.toString());
}
