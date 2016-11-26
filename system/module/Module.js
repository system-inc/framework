// Dependencies
import Settings from 'system/settings/Settings.js';

// Class
class Module {

	// The title of the module
	title = null;

	// The version of the module
	version = null;

	// The settings for the module
	settings = null;
	defaultSettings = null;

	// Other modules this module depends - these dependency modules will be initialized before this module is initialized
	dependencies = [];

	// Track module initialization status
	isInitialized = false;

	constructor(moduleTitle) {
		//app.log('Constructing', moduleTitle);
		this.title = moduleTitle;

		// Load the modules this module depends on
		Module.require(this.dependencies);
	}

	async initialize(settings) {
		// Initialize the modules this module dependencies
		await Module.initialize(this.dependencies);

		// Initialize the settings
		this.settings = new Settings(this.defaultSettings, settings);
	}

	static async require(moduleTitles) {
		//app.log('moduleTitles', moduleTitles);

		// Load each module
		await moduleTitles.toArray().each(async function(moduleTitleIndex, moduleTitle) {
			var modulePropertyTitle = moduleTitle.lowercaseFirstCharacter();

			// Only require modules once
			if(app.modules[modulePropertyTitle]) {
				//console.log('Already called Module.require for '+moduleTitle+'.');
			}
			// Require the module
			else {
				// Require the module
				var modulePath = Node.Path.join(app.framework.directory, 'modules', moduleTitle.replaceLast('Module', '').toDashes(), moduleTitle+'.js');
				//console.log('modulePath', modulePath);	

				try {
					var moduleClass = require(modulePath).default;
					//console.log('moduleClass', moduleClass);
					var moduleInstance = new (moduleClass)(moduleTitle);

					app.modules[modulePropertyTitle] = moduleInstance;	
				}
				catch(error) {
					app.error('Failed to load '+moduleTitle+' from '+modulePath+'.', "\n\n", error);
					throw error;
				}
			}
		});
	}

	static async initialize(moduleTitles) {
		//app.log('moduleTitles', moduleTitles);

		// Initializing is necessary to do separate of .require because module code may be interdependent and require other code to be required first
		var moduleTitlesArray = moduleTitles.toArray();

		await moduleTitlesArray.each(async function(moduleTitleIndex, moduleTitle) {
			//app.log('Module.initialize moduleTitle', moduleTitle);

			var modulePropertyTitle = moduleTitle.lowercaseFirstCharacter();

			var moduleInstance = app.modules[modulePropertyTitle];

			// Only initialize modules once
			if(moduleInstance.isInitialized) {
				//app.info('Already called Module.initialize for '+moduleTitle+'.'); // Can comment this out, just leaving this here to see when it triggers
			}
			else {
				//app.log('Initializing', moduleTitle, 'module...');
				var settings = app.settings.get('modules.'+moduleTitle.replaceLast('Module', '').lowercaseFirstCharacter());
				
				//app.log('initializing', moduleTitle+'Module');
				//app.log(moduleInstance, settings);

				await moduleInstance.initialize(settings);

				// Mark the instance as being initialized
				moduleInstance.isInitialized = true;

				//app.log('Initialized', moduleTitle+'Module');
			}
		});
	}

}

// Export
export default Module;
