require('./Controller');
require('./Cookie');
require('./Cookies');
require('./Header');
require('./Headers');
require('./Request');
require('./Response');
require('./Route');
require('./RouteMatch');
require('./Router');
require('./View');
require('./WebServer');

WebServerModuleClass = Module.extend({

	version: new Version('1.0'),
	webServers: {},

	construct: function(settings) {
		this.super(settings);

		// Inspect the settings to see if they want a web server
		var webServersSettings = this.settings.get('webServers');
		if(webServersSettings) {
			var webServerCount = 0;
			webServersSettings.each(function(webServerSettings) {
				// Create a web server
				var webServer = new WebServer(webServerSettings);

				// Make sure the web server has an identifier
				if(!webServer.identifier) {
					var webServerIdentifier = Project.identifier+'-web-server';
					if(webServerCount > 0) {
						webServerIdentifier += '-'+webServerCount;
					}
					webServer.identifier = webServerIdentifier;
				}

				// Add the web server to WebServerModule
				this.webServers[webServer.identifier] = webServer;

				webServerCount++;
			}, this);
		}
	},
	
});