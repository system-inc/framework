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
		Module.require(this.needs);

		// Require the files this module uses
		this.uses.each(function(index, fileToRequire) {
			var path = './modules/'+this.name.toDashes()+'/'+fileToRequire;
			//console.log(path);
			Framework.require(path);
		}.bind(this));
	},

	initialize: function*(settings) {
		// Initialize the modules this module needs
		yield Module.initialize(this.needs);

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
	// Keep track of required modules
	required: [],
	// Keep track of initialized modules
	initialized: [],
}

// Static methods

Module.requireCoreModules = function() {
	Module.require(Module.modules.core);
}

Module.require = function(moduleNames) {
	//console.log('moduleNames', moduleNames);

	// Load each module
	moduleNames.toArray().each(function(index, moduleName) {
		// Only require modules once
		if(Module.modules.required.contains(moduleName)) {
			//console.log('Already called Module.require for', moduleName);
		}
		// Load the module
		else {
			// Load the module
			Framework.require('modules', moduleName.toDashes(), moduleName+'Module');

			// Construct the module and store it as a global variable, replacing the module class
			global[moduleName+'Module'] = new global[moduleName+'Module'](moduleName);

			Module.modules.required.append(moduleName);
		}
	});
}

Module.initializeCoreModules = function*() {
	yield Module.initialize(Module.modules.core);
}.toPromise();

Module.initialize = function*(moduleNames) {
	//console.log('moduleNames', moduleNames);

	// Initializing is necessary to do separate of .require because module code may be interdependent and require other code to be required first
	yield moduleNames.toArray().each(function*(index, moduleName) {
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
			
			//console.log('initializing', moduleName+'Module');	
			//console.log(global[moduleName+'Module'], settings);
			yield global[moduleName+'Module'].initialize(settings);
			//console.log('initialized', moduleName+'Module');

			Module.modules.initialized.append(moduleName);
		}
	});
}.toPromise();