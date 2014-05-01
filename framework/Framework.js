// Node
NodeFileSystem = require('fs');
NodeHttp = require('http');
NodeUrl = require('url');
NodeZlib = require('zlib');
NodeCrypto = require('crypto');

// Framework objects (always require)
require('./objects/Function');
require('./objects/Object');
require('./objects/Class');
require('./objects/Promise');

// Framework types (always require)
require('./types/Array');
require('./types/Json');
require('./types/Number');
require('./types/String');
require('./types/Time');

// Include these dynamically somehow
require('./modules/server/Server');
require('./modules/web-server/WebServer');
require('./modules/file-system/FileSystemObject');
require('./modules/file-system/Directory');
require('./modules/file-system/File');

// Testing
Promise = require('bluebird'); // Use Bluebird for now until I write my own (so I understand what is going on)
PromiseFileSystem = Promise.promisifyAll(require('fs'));

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