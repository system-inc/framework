// Node
NodeFileSystem = require('fs');
NodeHttp = require('http');
NodeHttps = require('https');
NodeUrl = require('url');
NodeZlib = require('zlib');
NodeCrypto = require('crypto');
NodeUtility = require('util');

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

	version: '1.0',
	framework: {
		path: __dirname+'/',
	},
	path: null,
	settings: null,
	environment: null,
	coreModules: [
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

	construct: function(path) {
		// Announce loading
		Log.log('Starting Framework '+this.version+'...');

		// Set the project path
		this.path = path;

		// Initialize the version
		this.version = new Version(this.version);

		// Load the Framework core modules
		Module.load(this.coreModules);

		// Load the project settings
		Log.log('Loading project settings...');
		this.settings = Settings.constructFromFile(this.path+'settings/settings.json');
		//Log.log(this.settings);

		// Merge the environment settings
		this.settings.mergeSettingsFromFile(this.path+'settings/environment.json');
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

// Static methods
Framework.createWebServer = Framework.prototype.createWebServer;