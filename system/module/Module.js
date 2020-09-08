// Dependencies
import { Settings } from '@framework/system/settings/Settings.js';

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
		Module.import(this.dependencies);
	}

	async initialize(settings) {
		// Initialize the modules this module dependencies
		await Module.initialize(this.dependencies);

		// Initialize the settings
		this.settings = new Settings(this.defaultSettings, settings);
	}

	static async import(moduleTitles) {
		//app.log('moduleTitles', moduleTitles);
		var frameworkPath = app.framework.path;
		// console.log('frameworkPath', frameworkPath);

		// Load each module
		await moduleTitles.toArray().each(async function(moduleTitleIndex, moduleTitle) {
			var modulePropertyTitle = moduleTitle.lowercaseFirstCharacter();

			// Only import modules once
			if(app.modules[modulePropertyTitle]) {
				//console.log('Already called Module.import for '+moduleTitle+'.');
			}
			// Require the module
			else {
				// Require the module
				var modulePath = Node.Path.join(frameworkPath, 'modules', moduleTitle.replaceLast('Module', '').toDashes(), moduleTitle+'.js');
				// console.log('modulePath', modulePath);	

				try {
					//console.log('modulePath', modulePath);
					const moduleImports = await import(modulePath);
					//console.log('moduleImports', moduleImports);
					var moduleInstance = new (moduleImports[moduleTitle])(moduleTitle);
					//console.log('moduleInstance', moduleInstance);

					app.modules[modulePropertyTitle] = moduleInstance;	
				}
				catch(error) {
					//app.error('Failed to load '+moduleTitle+' from '+modulePath+'.', "\n\n", error);
					throw error;
				}
			}
		});
	}

	static async initialize(moduleTitles) {
		//app.log('moduleTitles', moduleTitles);

		// Initializing is necessary to do separate of .import because module code may be interdependent and import other code to be importd first
		var moduleTitlesArray = moduleTitles.toArray();

		await moduleTitlesArray.each(async function(moduleTitleIndex, moduleTitle) {
			//app.log('Module.initialize moduleTitle', moduleTitle);

			var modulePropertyTitle = moduleTitle.lowercaseFirstCharacter();

			var moduleInstance = app.modules[modulePropertyTitle];
			//console.log('app.modules', app.modules);
			//console.log('moduleTitle', moduleTitle, 'moduleInstance', moduleInstance);

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
export { Module };
