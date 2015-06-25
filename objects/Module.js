Module = Class.extend({

	version: null,
	settings: null,
	dependencies: [],

	construct: function(moduleName) {
		//console.log('Constructing', moduleName);

		// Require the dependencies
		this.dependencies.each(function(index, dependency) {
			var path = './modules/'+moduleName.toDashes()+'/'+dependency;
			//console.log(path);
			Framework.require(path);
		});
	},

	initialize: function(settings) {
		// Initialize the settings
		this.settings = Settings.constructFromObject(settings);
	},

});

// Static methods
Module.load = function(moduleNames) {
	//console.log('moduleNames', moduleNames);

	// Load each module
	moduleNames.toArray().each(function(index, moduleName) {
		// Construct the module path
		var modulePath = __dirname.replaceLast('objects', 'modules')+Node.Path.separator+moduleName.toDashes()+Node.Path.separator+moduleName+'Module';
		
		// Load the module
		//Console.out('Loading', modulePath, 'module...');
		Framework.require(modulePath);

		// Construct the module and store it as a global variable
		global[moduleName+'Module'] = new global[moduleName+'Module'](moduleName);
	}.bind(this));
}

Module.initialize = function(moduleNames) {
	//console.log('moduleNames', moduleNames);

	// Initializing is necessary to do separate of .load because module code may be interdependent and require other code to be loaded first
	moduleNames.toArray().each(function(index, moduleName) {
		//console.log('Initializing', moduleName.toSpaces(), 'module...');
		var settings = {};

		// Conditionally get the module settings from the project
		if(global['Project']) {
			settings = Project.settings.get('modules.'+moduleName.lowercaseFirstCharacter());
		}
		
		//console.log('moduleName', moduleName+'Module');
		global[moduleName+'Module'].initialize(settings);
	}.bind(this));
}