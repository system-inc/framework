// Node
NodeFileSystem = require('fs');
NodeHttp = require('http');
NodeUrl = require('url');
NodeZlib = require('zlib');
NodeCrypto = require('crypto');

// Framework objects (always require)
require('./objects/Object');
require('./objects/Function');
require('./objects/Class');

// Framework types (always require)
require('./types/Array');
require('./types/Json');
require('./types/Number');
require('./types/String');
require('./types/Time');

// Include these dynamically somehow
require('./modules/server/Server');
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