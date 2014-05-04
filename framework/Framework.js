// Node
NodeFileSystem = require('fs');
NodeHttp = require('http');
NodeUrl = require('url');
NodeZlib = require('zlib');
NodeCrypto = require('crypto');

// Framework objects (always require)
require('./objects/Function');
require('./objects/Generator');
require('./objects/Object');
require('./objects/Class');
require('./objects/Promise');

// Framework core types (always require)
require('./types/Array');
require('./types/Json');
require('./types/Number');
require('./types/String');

// Framework modules
require('./modules/file-system/FileSystem');
require('./modules/geolocation/Geolocation');
require('./modules/hardware/Hardware');
require('./modules/network/Network');
require('./modules/operating-system/OperatingSystem');
require('./modules/server/Server');
require('./modules/time/Time');
require('./modules/version-control/VersionControl');
require('./modules/web/Web');
require('./modules/web-server/WebServer');

FrameworkSingleton = Class.extend({

	construct: function() {
		this.path = __dirname+'/';
	},

	createWebServer: function() {
		this.webServer = new WebServer();
	}

});

// Static methods
FrameworkSingleton.createWebServer = FrameworkSingleton.prototype.createWebServer;

Framework = new FrameworkSingleton();