// Dependencies
import Settings from './../../system/settings/Settings.js';

// Class
class Module {

	// The name of the module
	name = null;

	// The version of the module
	version = null;

	// The settings for the module
	settings = null;
	defaultSettings = null;

	// Other modules this module depends - these dependency modules will be initialized before this module is initialized
	dependencies = [];

	// Track module initialization status
	isInitialized = false;

	constructor(moduleName) {
		//Console.log('Constructing', moduleName);
		this.name = moduleName;

		// Load the modules this module depends on
		Module.require(this.dependencies);
	}

	async initialize(settings) {
		// Initialize the modules this module dependencies
		await Module.initialize(this.dependencies);

		// Initialize the settings
		this.settings = new Settings(this.defaultSettings, settings);
	}

	static async require(moduleNames) {
		//Console.log('moduleNames', moduleNames);

		// Load each module
		await moduleNames.toArray().each(async function(moduleNameIndex, moduleName) {
			var modulePropertyName = moduleName.lowercaseFirstCharacter();

			// Only require modules once
			if(app.modules[modulePropertyName]) {
				//console.log('Already called Module.require for '+moduleName+'.');
			}
			// Require the module
			else {
				// Require the module
				var modulePath = Node.Path.join(app.framework.directory, 'modules', moduleName.replaceLast('Module', '').toDashes(), moduleName+'.js');
				console.log('need to use System.import here?');
				//var moduleClass = await System.import(modulePath);
				console.log('modulePath', modulePath);
				var moduleClass = require(modulePath).default;
				//console.log('moduleClass', moduleClass);
				var moduleInstance = new (moduleClass)(moduleName);

				app.modules[modulePropertyName] = moduleInstance;
			}
		});
	}

	static async initialize(moduleNames) {
		//Console.log('moduleNames', moduleNames);

		// Initializing is necessary to do separate of .require because module code may be interdependent and require other code to be required first
		await moduleNames.toArray().each(async function(moduleNameIndex, moduleName) {
			var modulePropertyName = moduleName.lowercaseFirstCharacter();

			var moduleInstance = app.modules[modulePropertyName];

			// Only initialize modules once
			if(moduleInstance.isInitialized) {
				//Console.info('Already called Module.initialize for '+moduleName+'.'); // Can comment this out, just leaving this here to see when it triggers
			}
			else {
				//Console.log('Initializing', moduleName, 'module...');
				var settings = app.settings.get('modules.'+moduleName.replaceLast('Module', '').lowercaseFirstCharacter());
				
				//Console.log('initializing', moduleName+'Module');
				//Console.log(moduleInstance, settings);

				await moduleInstance.initialize(settings);

				// Mark the instance as being initialized
				moduleInstance.isInitialized = true;

				//Console.log('initialized', moduleName+'Module');
			}
		});
	}

}

// Export
export default Module;
