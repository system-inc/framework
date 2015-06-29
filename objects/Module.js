Module = Class.extend({

	// The name of the module
	name: null,

	// The version of the module
	version: null,

	// The settings for the module
	settings: null,

	// Other modules this module depends on, but do not list core modules here
	needs: [],

	// Files this module will use and need to be Framework.require'd
	uses: [],

	construct: function(moduleName) {
		//console.log('Constructing', moduleName);
		this.name = moduleName;

		// Load the modules this module needs
		Module.load(this.needs);

		// Require the files this module uses
		this.uses.each(function(index, fileToRequire) {
			var path = './modules/'+this.name.toDashes()+'/'+fileToRequire;
			//console.log(path);
			Framework.require(path);
		}.bind(this));
	},

	initialize: function(settings) {
		// Initialize the modules this module needs
		Module.initialize(this.needs);

		// Initialize the settings
		this.settings = Settings.constructFromObject(settings);
	},

});

// Static properties

Module.modules = {
	// The only modules needed for Framework to run
	core: [
		'Console',
		'Cryptography',
		'FileSystem',
		'Log',
		'Settings',
		'Time',
	],
	// Keep track of loaded modules
	loaded: [],
	// Keep track of initialized modules
	initialized: [],
}

// Static methods

Module.loadCoreModules = function() {
	Module.load(Module.modules.core);
}

Module.initializeCoreModules = function() {
	Module.initialize(Module.modules.core);
}

Module.load = function(moduleNames) {
	//console.log('moduleNames', moduleNames);

	// Load each module
	moduleNames.toArray().each(function(index, moduleName) {
		// Only load modules once
		if(Module.modules.loaded.contains(moduleName)) {
			//console.log('Already called Module.load for', moduleName);
		}
		// Load the module
		else {
			// Construct the module path
			var modulePath = __dirname.replaceLast('objects', 'modules')+Node.Path.separator+moduleName.toDashes()+Node.Path.separator+moduleName+'Module';
			
			// Load the module
			//console.log('Loading', modulePath, 'module...');
			Framework.require(modulePath);

			// Construct the module and store it as a global variable
			global[moduleName+'Module'] = new global[moduleName+'Module'](moduleName);

			Module.modules.loaded.append(moduleName);
		}
	}.bind(this));
}

Module.initialize = function(moduleNames) {
	//console.log('moduleNames', moduleNames);

	// Initializing is necessary to do separate of .load because module code may be interdependent and require other code to be loaded first
	moduleNames.toArray().each(function(index, moduleName) {
		// Only initialize modules once
		if(Module.modules.initialized.contains(moduleName)) {
			//console.log('Already called Module.initialize for', moduleName);
		}
		else {
			//console.log('Initializing', moduleName, 'module...');
			var settings = {};

			// Conditionally get the module settings from the project
			if(global['Project']) {
				settings = Project.settings.get('modules.'+moduleName.lowercaseFirstCharacter());
				//Console.out('settings', settings);
			}
			
			//console.log('moduleName', moduleName+'Module');
			global[moduleName+'Module'].initialize(settings);

			Module.modules.initialized.append(moduleName);
		}
	}.bind(this));
}