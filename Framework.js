// Make it obvious we are starting
console.log("\x1B[90m\r\n        ____________\r\n       \/\\  ________ \\\r\n      \/  \\ \\______\/\\ \\\r\n     \/ \/\\ \\ \\  \/ \/\\ \\ \\\r\n    \/ \/ \/\\ \\ \\\/ \/ \/\\ \\ \\\r\n   \/ \/ \/__\\ \\ \\\/_\/__\\_\\ \\__________\r\n  \/ \/_\/____\\ \\__________  ________ \\\r\n  \\ \\ \\____\/ \/ ________\/\\ \\______\/\\ \\\r\n   \\ \\ \\  \/ \/ \/\\ \\  \/ \/\\ \\ \\  \/ \/\\ \\ \\\r\n    \\ \\ \\\/ \/ \/\\ \\ \\\/ \/ \/\\ \\ \\\/ \/ \/\\ \\ \\\r\n     \\ \\\/ \/ \/__\\_\\\/ \/ \/__\\ \\ \\\/_\/__\\_\\ \\\r\n      \\  \/_\/______\\\/_\/____\\ \\___________\\\r\n      \/  \\ \\______\/\\ \\____\/ \/ ________  \/\r\n     \/ \/\\ \\ \\  \/ \/\\ \\ \\  \/ \/ \/\\ \\  \/ \/ \/\r\n    \/ \/ \/\\ \\ \\\/ \/ \/\\ \\ \\\/ \/ \/\\ \\ \\\/ \/ \/\r\n   \/ \/ \/__\\ \\ \\\/_\/__\\_\\\/ \/ \/__\\_\\\/ \/ \/\r\n  \/ \/_\/____\\ \\_________\\\/ \/______\\\/ \/\r\n  \\ \\ \\____\/ \/ ________  __________\/\r\n   \\ \\ \\  \/ \/ \/\\ \\  \/ \/ \/\r\n    \\ \\ \\\/ \/ \/\\ \\ \\\/ \/ \/\r\n     \\ \\\/ \/ \/__\\_\\\/ \/ \/\r\n      \\  \/ \/______\\\/ \/\r\n       \\\/___________\/  \u00A9 "+new Date().getFullYear()+" framework.app\n\x1B[39m");

// Node
require('./Node');

// Framework core objects
require('./objects/Function');
require('./objects/Generator');
require('./objects/Object');
require('./objects/Promise');
require('./objects/Class');
require('./objects/Error');
require('./objects/Version');
require('./objects/Module');

// Framework core types
require('./types/Array');
require('./types/Boolean');
require('./types/Buffer');
require('./types/Json');
require('./types/Number');
require('./types/Primitive');
require('./types/RegularExpression');
require('./types/String');

// TODO: Need to rethink this - all of these are required before coreModules are initialized
require('./modules/settings/SettingsModule');
require('./modules/file-system/FileSystemModule');
require('./modules/log/LogModule');
require('./modules/console/ConsoleModule');
require('./modules/time/TimeModule');

Framework = Class.extend({

	title: 'Project',
	identifier: 'project',
	version: null,
	framework: {
		directory: __dirname+Node.Path.separator,
	},
	directory: null,
	settings: null,
	environment: null,

	// Need to prune this list
	coreModules: [
		'Console',
		'Cryptography',
		'Database',
		'Email',
		'FileSystem',
		'Geolocation',
		'Hardware',
		'Log',
		'Network',
		'OperatingSystem',
		'Server',
		'Settings',
		'Time',
		'Data',
		'Web',
		'WebServer',
		'Xml',
		'Html',
	],

	construct: function(directory) {
		// Initialize the version
		this.version = new Version('.2');

		// Set the project directory
		this.directory = Node.Path.normalize(directory+Node.Path.separator);

		// Announce loading
		Console.out('Starting Framework '+this.version+'...');

		// Load the Framework core modules
		//Console.out('Loading modules...');
		Module.load(this.coreModules);

		// Load the project settings
		//Console.out('Loading project settings...');
		this.settings = Settings.constructFromFile(this.directory+'settings'+Node.Path.separator+'settings.json');

		// Set the default settings
		this.settings.default({
			environment: 'development',
		})
		//Console.out(this.settings);

		// Set the title
		var title = this.settings.get('title');
		if(title) {
			this.title = title;
		}

		// Set the identifier
		var identifier = this.settings.get('identifier');
		if(identifier) {
			this.identifier = identifier;
		}
		else {
			this.identifier = this.title.toCamelCase();
		}

		// Anounce project title
		Console.out('Loaded settings for project "'+this.title+'".');

		// Merge the environment settings
		//Console.out('Integrating environment settings...')
		this.settings.integrateSettingsFromFile(this.directory+'settings'+Node.Path.separator+'environment.json');
		//Console.out(this.settings);

		// Initialize the environment
		this.initializeEnvironment();
	},

	initialize: function() {
		// Initialize the Framework core modules
		Module.initialize(this.coreModules);
	},

	initializeEnvironment: function() {
		this.environment = this.settings.get('environment');
		
		// Development
		if(this.environment == 'development') {
		}

		Console.out('Initialized environment ('+this.environment+')...');
	},

});

// Static methods
Framework.eventEmitter = new EventEmitter();
Framework.emit = function(eventName, data) {
	Framework.eventEmitter.emit(eventName, data);
}
Framework.on = function(eventName, callback) {
	Framework.eventEmitter.on(eventName, callback);
};