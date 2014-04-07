// Node
NodeFileSystem = require('fs');
NodeHttp = require('http');

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
require('./modules/web-server/Router');

Framework = Class.extend({

	construct: function() {
	},

	createWebServer: function() {
		this.webServer = new WebServer();
	}

});

// Static methods
Framework.createWebServer = Framework.prototype.createWebServer;