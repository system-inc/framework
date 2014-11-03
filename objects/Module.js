Module = Class.extend({

	version: null,
	settings: null,

	construct: function(settings) {
		// TODO: Fix this kludge and find out why require() on a module is invoking it's constructor
		// Create settings if we are intializing and not loading - not sure why .construct() is being called when I require() a module
		if(global['Settings']) {
			this.settings = Settings.constructFromObject(settings);
		}
	},

	load: function(moduleNames) {
		// Load each module
		moduleNames.toArray().each(function(index, moduleName) {
			Console.out('Loading', moduleName.toSpaces(), 'module...');
			var modulePath = __dirname.replaceLast('objects', 'modules')+'/'+moduleName.toDashes()+'/'+moduleName+'Module';
			require(modulePath);
		}, this);
	},

	initialize: function(moduleNames) {
		// Initializing is necessary to do separate of .load because module code may be interdependent and require other code to be loaded first
		moduleNames.toArray().each(function(index, moduleName) {
			//console.log('Initializing', moduleName.toSpaces(), 'module...');

			var settings = {};

			// Conditionally get the module settings from the project
			if(global['Project']) {
				settings = Project.settings.get('modules.'+moduleName.lowercaseFirstCharacter());
			}
			
			global[moduleName+'Module'] = new global[moduleName+'ModuleClass'](settings);
		}, this);
	}

});

// Static methods
Module.load = Module.prototype.load;
Module.initialize = Module.prototype.initialize;