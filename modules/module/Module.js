// Globals
Modules = {};

// Class
var Module = Class.extend({

	// The name of the module
	name: null,

	// The version of the module
	version: null,

	// The settings for the module
	settings: null,
	defaultSettings: null,

	// Other modules this module depends - these dependency modules will be initialized before this module is initialized
	dependencies: [],

	// Track module initialization status
	isInitialized: false,

	construct: function(moduleName) {
		//Console.log('Constructing', moduleName);
		this.name = moduleName;

		// Load the modules this module depends on
		Module.require(this.dependencies);
	},

	initialize: function*(settings) {
		// Initialize the modules this module dependencies
		yield Module.initialize(this.dependencies);

		// Initialize the settings
		this.settings = new Settings(settings, this.defaultSettings);
	},

});

// Static methods

Module.require = function(moduleNames) {
	//Console.log('moduleNames', moduleNames);

	// Load each module
	moduleNames.toArray().each(function(moduleNameIndex, moduleName) {
		// Only require modules once
		if(Modules[moduleName]) {
			//Console.info('Already called Module.require for '+moduleName+'.');
		}
		// Require the module
		else {
			// Require the module
			var moduleClass = Framework.require('modules/'+moduleName.toDashes()+'/'+moduleName+'Module.js');
			var moduleInstance = new (moduleClass)(moduleName);

			Modules[moduleName] = moduleInstance;
		}
	});
}

Module.initialize = function*(moduleNames) {
	//Console.log('moduleNames', moduleNames);

	// Initializing is necessary to do separate of .require because module code may be interdependent and require other code to be required first
	yield moduleNames.toArray().each(function*(moduleNameIndex, moduleName) {
		var moduleInstance = Modules[moduleName];

		// Only initialize modules once
		if(moduleInstance.isInitialized) {
			//Console.info('Already called Module.initialize for '+moduleName+'.'); // Can comment this out, just leaving this here to see when it triggers
		}
		else {
			//Console.log('Initializing', moduleName, 'module...');
			var settings = {};

			// Conditionally get the module settings from the project
			if(global['Project']) {
				settings = Project.settings.get('modules.'+moduleName.lowercaseFirstCharacter());
				//Console.log('settings', settings);
			}
			
			//Console.log('initializing', moduleName+'Module');
			//Console.log(moduleInstance, settings);

			yield moduleInstance.initialize(settings);

			// Mark the instance as being initialized
			moduleInstance.isInitialized = true;

			//Console.log('initialized', moduleName+'Module');
		}
	});
}.toPromise();

// Export
module.exports = Module;