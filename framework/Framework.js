// Node
NodeCrypto = require('crypto');
NodeFileSystem = require('fs');
NodeHttp = require('http');
NodeHttps = require('https');
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
require('./objects/Class');
require('./objects/Version');
require('./objects/Module');

// Framework core types
require('./types/Array');
require('./types/Json');
require('./types/Number');
require('./types/String');

// TODO: Need to rethink this
require('./modules/log/Log');
require('./modules/time/Time');

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
		// Set the project directory
		this.directory = directory;

		// Initialize the version
		this.version = new Version('1.0');

		// Announce loading
		Log.log('Starting Framework '+this.version+'...');

		// Load the Framework core modules
		Module.load(this.coreModules);

		// Load the project settings
		Log.log('Loading project settings...');
		this.settings = Settings.constructFromFile(this.directory+'settings/settings.json');
		//Log.log(this.settings);

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
		Log.log('Loaded settings for project "'+this.title+'".');

		// Merge the environment settings
		Log.log('Merging environment settings...')
		this.settings.mergeSettingsFromFile(this.directory+'settings/environment.json');
		//Log.log(this.settings);

		// Initialize the environment
		this.initializeEnvironment();
	},

	initialize: function() {
		// Initialize the Framework core modules
		Module.initialize(this.coreModules);
	},

	initializeEnvironment: function() {
		this.environment = this.settings.get('environment');
		Log.log('Initializing environment ('+this.environment+')...');

		// Development
		if(this.environment == 'development') {
			// Long stack traces imply a substantial performance penalty, around 4-5x for throughput and 0.5x for latency
			//Promise.longStackTraces();
		}
	},

});