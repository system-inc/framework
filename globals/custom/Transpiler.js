require('./../libraries/babel/babel-register/babel-register/node.js')({
	presets: [
		'es2015',
		'stage-0',
	],
});

Transpiler = {};

// Export
module.exports = Transpiler;