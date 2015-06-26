WebServerModule = Module.extend({

	version: new Version('0.1.0'),

	needs: [
		'Email',
		'Server',
		'Web',
	],

	uses: [
		'Controller',
		'Request',
		'Response',
		'Router',
		'routes/Route',
		'routes/ControllerRoute',
		'routes/FileRoute',
		'routes/ProxyRoute',
		'routes/RedirectRoute',
		'RouteMatch',
		'View',
		'WebServer',
		'errors/HttpError',
		'errors/InternalServerError',
		'errors/NotFoundError',
		'errors/RequestEntityTooLargeError',
	],

	webServers: {},

	initialize: function(settings) {
		this.super.apply(this, settings);

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
			}.bind(this));
		}
	},
	
});