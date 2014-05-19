// Node
NodeFileSystem = require('fs');
NodeHttp = require('http');
NodeUrl = require('url');
NodeZlib = require('zlib');
NodeCrypto = require('crypto');

// Framework core objects
require('./objects/Function');
require('./objects/Generator');
require('./objects/Object');
require('./objects/Class');
require('./objects/Promise');
require('./objects/Version');
require('./objects/Module');

// Framework core types
require('./types/Array');
require('./types/Json');
require('./types/Number');
require('./types/String');

FrameworkSingleton = Class.extend({

	path: __dirname+'/',
	version: 1.0,
	settings: null,
	coreModules: [
		'Settings',
		'Cryptography',
		'FileSystem',
		'Geolocation',
		'Hardware',
		'Network',
		'OperatingSystem',
		'Server',
		'Time',
		'Web',
		'WebServer',
	],

	construct: function() {
		// Initialize the Framework core modules
		Module.load(this.coreModules);

		// Initialize the version
		this.version = new Version(this.version);
		console.log(this.version);

		// Load the settings
		this.settings = new Settings(this.path+'settings/settings.json');
	},

	createWebServer: function() {
		this.webServer = new WebServer();
	}

});

// Static methods
FrameworkSingleton.createWebServer = FrameworkSingleton.prototype.createWebServer;

// Create the Framework singleton
Framework = new FrameworkSingleton();