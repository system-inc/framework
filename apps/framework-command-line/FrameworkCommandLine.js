// Disable the Babel cache for debugging
//process.env.BABEL_DISABLE_CACHE = 1;

// Include the Babel polyfill when generator support is not available
require('babel-polyfill');

// Integrate transpilation with import statements
require('babel-register')({
	presets: [
		'latest',
		'stage-0',
	],
	sourceMaps: 'both',
});

require('./FrameworkCommandLineApp.js');

//var Babel = require('babel-core');
//var transpiledCode = Babel.transform(
//	`
//		class ChildClass extends ParentClass {

//			classProperty = 'child';
//			childClassProperty = 'child';

//		}

//		class ParentClass extends GrandParentClass {

//			classProperty = 'parent';
//			parentClassProperty = 'parent';

//		}

//		class GrandParentClass {

//			classProperty = 'grandParent';
//			grandParentClassProperty = 'grandParent';

//		}
//	`,
//	{
//		presets: [
//			'latest',
//			'stage-0',
//		],
//		sourceMaps: 'both',
//	}
//);

//console.log(transpiledCode.code);
