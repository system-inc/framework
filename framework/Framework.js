// Make it obvious we are starting
console.log("\x1B[90m        ____________\r\n       \/\\  ________ \\\r\n      \/  \\ \\______\/\\ \\\r\n     \/ \/\\ \\ \\  \/ \/\\ \\ \\\r\n    \/ \/ \/\\ \\ \\\/ \/ \/\\ \\ \\\r\n   \/ \/ \/__\\ \\ \\\/_\/__\\_\\ \\__________\r\n  \/ \/_\/____\\ \\__________  ________ \\\r\n  \\ \\ \\____\/ \/ ________\/\\ \\______\/\\ \\\r\n   \\ \\ \\  \/ \/ \/\\ \\  \/ \/\\ \\ \\  \/ \/\\ \\ \\\r\n    \\ \\ \\\/ \/ \/\\ \\ \\\/ \/ \/\\ \\ \\\/ \/ \/\\ \\ \\\r\n     \\ \\\/ \/ \/__\\_\\\/ \/ \/__\\ \\ \\\/_\/__\\_\\ \\\r\n      \\  \/_\/______\\\/_\/____\\ \\___________\\\r\n      \/  \\ \\______\/\\ \\____\/ \/ ________  \/\r\n     \/ \/\\ \\ \\  \/ \/\\ \\ \\  \/ \/ \/\\ \\  \/ \/ \/\r\n    \/ \/ \/\\ \\ \\\/ \/ \/\\ \\ \\\/ \/ \/\\ \\ \\\/ \/ \/\r\n   \/ \/ \/__\\ \\ \\\/_\/__\\_\\\/ \/ \/__\\_\\\/ \/ \/\r\n  \/ \/_\/____\\ \\_________\\\/ \/______\\\/ \/\r\n  \\ \\ \\____\/ \/ ________  __________\/\r\n   \\ \\ \\  \/ \/ \/\\ \\  \/ \/ \/\r\n    \\ \\ \\\/ \/ \/\\ \\ \\\/ \/ \/\r\n     \\ \\\/ \/ \/__\\_\\\/ \/ \/\r\n      \\  \/ \/______\\\/ \/\r\n       \\\/___________\/  \u00A9 "+new Date().getFullYear()+" framework.app\n\x1B[39m");

// Node
NodeCrypto = require('crypto');
NodeDomain = require('domain');
NodeFileSystem = require('fs');
NodeHttp = require('http');
NodeHttps = require('https');
NodePath = require('path');
NodeProcess = process;
NodeStandardIn = NodeProcess.stdin;
NodeStandardOut = NodeProcess.stdout;
NodeUrl = require('url');
NodeUtility = require('util');
NodeZlib = require('zlib');

// Framework core objects
require('./objects/Function');
require('./objects/Generator');
require('./objects/Object');
require('./objects/Promise');
	// TODO Move this
	// Long stack traces imply a substantial performance penalty, around 4-5x for throughput and 0.5x for latency
	Promise.longStackTraces();
require('./objects/Class');
require('./objects/Version');
require('./objects/Module');

// Framework core types
require('./types/Array');
require('./types/Json');
require('./types/Number');
require('./types/String');

// TODO: Need to rethink this
require('./modules/file-system/FileSystemModule');
require('./modules/log/LogModule');
require('./modules/console/ConsoleModule');
require('./modules/time/TimeModule');

Framework = Class.extend({

	title: 'Project',
	identifier: 'project',
	version: null,
	framework: {
		directory: __dirname+'/',
	},
	directory: null,
	settings: null,
	environment: null,
	coreModules: [
		'Console',
		'Cryptography',
		'FileSystem',
		'Geolocation',
		'Hardware',
		'Log',
		'Network',
		'OperatingSystem',
		'Server',
		'Settings',
		'Time',
		'Web',
		'WebServer',
	],

	construct: function(directory) {
		// Initialize the version
		this.version = new Version('1.0');

		// Set the project directory
		this.directory = directory;

		// Announce loading
		Console.out('Starting Framework '+this.version+'...');

		// Load the Framework core modules
		Console.out('Loading modules...');
		Module.load(this.coreModules);

		// Load the project settings
		Console.out('Loading project settings...');
		this.settings = Settings.constructFromFile(this.directory+'settings/settings.json');
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
			this.identifier = this.title.toDashes();
		}

		// Anounce project title
		Console.out('Loaded settings for project "'+this.title+'".');

		// Merge the environment settings
		Console.out('Merging environment settings...')
		this.settings.mergeSettingsFromFile(this.directory+'settings/environment.json');
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
		Console.out('Initializing environment ('+this.environment+')...');

		// Development
		if(this.environment == 'development') {
		}
	},

});