// Node
require('./Node');

// Framework core objects
require('./objects/Function');
require('./objects/Generator');
require('./objects/Object');
require('./objects/Json');
require('./objects/Promise');
require('./objects/Class');
require('./objects/Error');
require('./objects/Version');
require('./objects/Module');
require('./objects/Command');

// Framework core types
require('./types/Array');
require('./types/Boolean');
require('./types/Buffer');
require('./types/Number');
require('./types/Primitive');
require('./types/RegularExpression');
require('./types/Stream');
require('./types/String');

Framework = Class.extend({

	title: null,
	identifier: null,
	version: new Version('0.1.0'),
	framework: {
		directory: __dirname+Node.Path.separator,
	},
	directory: null,
	settings: null,
	environment: null,
	command: null,

	construct: function(projectDirectory) {
		// Make it obvious we are starting
		console.log("\x1B[90m\r\n        ____________\r\n       \/\\  ________ \\\r\n      \/  \\ \\______\/\\ \\\r\n     \/ \/\\ \\ \\  \/ \/\\ \\ \\\r\n    \/ \/ \/\\ \\ \\\/ \/ \/\\ \\ \\\r\n   \/ \/ \/__\\ \\ \\\/_\/__\\_\\ \\__________\r\n  \/ \/_\/____\\ \\__________  ________ \\\r\n  \\ \\ \\____\/ \/ ________\/\\ \\______\/\\ \\\r\n   \\ \\ \\  \/ \/ \/\\ \\  \/ \/\\ \\ \\  \/ \/\\ \\ \\\r\n    \\ \\ \\\/ \/ \/\\ \\ \\\/ \/ \/\\ \\ \\\/ \/ \/\\ \\ \\\r\n     \\ \\\/ \/ \/__\\_\\\/ \/ \/__\\ \\ \\\/_\/__\\_\\ \\\r\n      \\  \/_\/______\\\/_\/____\\ \\___________\\\r\n      \/  \\ \\______\/\\ \\____\/ \/ ________  \/\r\n     \/ \/\\ \\ \\  \/ \/\\ \\ \\  \/ \/ \/\\ \\  \/ \/ \/\r\n    \/ \/ \/\\ \\ \\\/ \/ \/\\ \\ \\\/ \/ \/\\ \\ \\\/ \/ \/\r\n   \/ \/ \/__\\ \\ \\\/_\/__\\_\\\/ \/ \/__\\_\\\/ \/ \/\r\n  \/ \/_\/____\\ \\_________\\\/ \/______\\\/ \/\r\n  \\ \\ \\____\/ \/ ________  __________\/\r\n   \\ \\ \\  \/ \/ \/\\ \\  \/ \/ \/\r\n    \\ \\ \\\/ \/ \/\\ \\ \\\/ \/ \/\r\n     \\ \\\/ \/ \/__\\_\\\/ \/ \/  Framework "+this.version+"\r\n      \\  \/ \/______\\\/ \/   \u00A9 "+new Date().getFullYear()+" System, Inc.\r\n       \\\/___________\/\n\x1B[39m");

		// Set the project directory
		this.directory = Node.Path.normalize(projectDirectory+Node.Path.separator);
	},

	initialize: function*() {
		// Load the core modules
		Module.loadCoreModules();

		// Announce starting
		//Console.out('Initializing Framework '+this.version+'...');

		// Use core modules to load the project settings
		yield this.loadProjectSettings();

		// Load the command
		this.command = new Command(Node.Process.argv, this.settings.get('command'));

		// Use project settings to set the title and the identifier
		this.setTitleAndIdentifier();

		// Use projet settings to configure the environment
		this.configureEnvironment();

		// After the environment is initialized, initialize the Framework core modules
		yield Module.initializeCoreModules();

		// Load all of the modules for the Project indicated in the project settings
		yield this.loadAndInitializeProjectModules();

		//Console.out('Framework initialization complete.');
		Console.out('Initialized "'+this.title+'" in '+this.environment+' environment.');
		//Console.out('Modules: '+Module.modules.initialized.join(', '));
	},

	loadProjectSettings: function*() {
		//Console.out('Loading project settings...');

		this.settings = Settings.constructFromFile(Node.Path.join(this.directory+'settings', 'settings.json'));

		// Set the default settings
		this.settings.default({
			environment: 'development',
		});
		//Console.out(this.settings);

		// Merge the environment settings
		//Console.out('Integrating environment settings...')
		this.settings.integrateSettingsFromFile(Node.Path.join(this.directory+'settings', 'environment.json'));
		//Console.out(this.settings);
	},

	setTitleAndIdentifier: function() {
		// Set the title
		var title = this.settings.get('title');
		if(title) {
			this.title = title;
		}

		// Anounce project title
		//Console.out('Settings for project "'+this.title+'" loaded.');

		// Set the identifier
		var identifier = this.settings.get('identifier');
		if(identifier) {
			this.identifier = identifier;
		}
		else {
			this.identifier = this.title.toCamelCase();
		}
	},

	configureEnvironment: function() {
		this.environment = this.settings.get('environment');

		//Console.out('Configuring environment ('+this.environment+')...');

		// Development
		if(this.environment == 'development') {
		}
	},

	onWindows: function() {
		return Node.Process.platform == 'win32';
	},

	onOsX: function() {
		return Node.Process.platform == 'darwin';
	},

	onLinux: function() {
		return Node.Process.platform == 'linux';
	},

	loadAndInitializeProjectModules: function*() {
		//Console.out('Loading modules for project...');

		// Load and initialize project modules separately in case multiple project modules rely on each other
		var modulesForProject = [];

		// Load the modules
		this.settings.get('modules').each(function(moduleName, moduleSettings) {
			moduleName = moduleName.uppercaseFirstCharacter();
			
			//Console.out('Loading "'+moduleName+'" module...');

			Module.load(moduleName);

			// Store the module name for initialization later
			modulesForProject.append(moduleName);
		}.bind(this));
		
		// Initialize the modules for the Project
		yield Module.initialize(modulesForProject);
	},	

});

// Static methods and properties

// Run all require calls through this method
Framework.require = function(identifier) {
	//console.log('Framework.require', identifier);

	try {
		return require(identifier);
	}
	catch(exception) {
		console.error('Framework.require', identifier, exception);
		return false;
	}
}

// Attach an event emitter
Framework.eventEmitter = new EventEmitter();
Framework.emit = function(eventName, data) {
	Framework.eventEmitter.emit(eventName, data);
}
Framework.on = function(eventName, callback) {
	Framework.eventEmitter.on(eventName, callback);
};