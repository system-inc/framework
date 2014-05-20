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
require('./objects/Project');

// Framework core types
require('./types/Array');
require('./types/Json');
require('./types/Number');
require('./types/String');

FrameworkSingleton = Class.extend({

	version: '1.0',
	path: __dirname+'/',
	settings: null,
	coreModules: [
		'Cryptography',
		'FileSystem',
		'Geolocation',
		'Hardware',
		'Network',
		'OperatingSystem',
		'Server',
		'Settings',
		'Time',
		'Web',
		'WebServer',
	],
	webServer: null,

	construct: function() {
		// Announce loading
		console.log('-------------------------');
		console.log('Starting Framework '+this.version+'...');

		// Initialize the Framework core modules
		Module.load(this.coreModules);

		// Initialize the version
		this.version = new Version(this.version);

		// Load the settings
		console.log('Loading global Framework settings...');
		this.settings = new Settings(this.path+'settings/settings.json');
	},

	attachProject: function(project) {
		console.log('Attaching project "'+project.settings.get('title')+'" to Framework...');

		// Inspect the project settings to see if they want a web server
		var webServerSettings = project.settings.get('modules.webServer');
		//console.log('webServerSettings', webServerSettings);
		if(webServerSettings) {
			// Create a web server if we need one and don't have one already
			if(!this.webServer) {
				this.webServer = new WebServer();		
			}

			// Listen on the ports specified
			this.webServer.listen(webServerSettings.ports);

			// Load the project's routes in the web server's router
			this.webServer.router.loadRoutes(webServerSettings.router.routes);
		}		
	},

	detatchProject: function(project) {

	},

});

// Static methods
FrameworkSingleton.createWebServer = FrameworkSingleton.prototype.createWebServer;

// Create the Framework singleton
Framework = new FrameworkSingleton();