require('./Controller');
require('./Request');
require('./Response');
require('./router/Router');
require('./WebServer');
require('./errors/HttpError');

WebServerModuleClass = Module.extend({

	version: null,
	webServers: {},

	construct: function(settings) {
		this.version = new Version('1.0');
		this.super(settings);		

		// Inspect the settings to see if they want a web server
		var webServersSettings = this.settings.get('webServers');
		if(webServersSettings) {
			var webServerCount = 0;
			webServersSettings.each(function(index, webServerSettingsObject) {
				// Get an instance of class Settings to localize to the web server
				var webServerSettings = Settings.constructFromObject(webServerSettingsObject);
				var webServerIdentifier = webServerSettings.get('identifier');

				// Make sure the web server has an identifier
				if(!webServerIdentifier) {
					webServerIdentifier = Project.identifier;
					if(webServerCount > 0) {
						webServerIdentifier += ''+webServerCount;
					}
				}

				//Console.out('Initializing web server...');

				// Create the web server
				var webServer = new WebServer(webServerIdentifier, webServerSettings);

				// Add the web server to WebServerModule
				this.webServers[webServer.identifier] = webServer;

				webServerCount++;
			}, this);
		}
	},
	
});