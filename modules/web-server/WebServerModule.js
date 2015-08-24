WebServerModule = Module.extend({

	version: new Version('0.1.0'),

	needs: [
		'Hardware',
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
		'errors/BadRequestError',
		'errors/ForbiddenError',
		'errors/InternalServerError',
		'errors/NotFoundError',
		'errors/RequestedRangeNotSatisfiableError',
		'errors/RequestEntityTooLargeError',
		'errors/UnauthorizedError',
	],

	webServers: {},

	initialize: function*(settings) {
		yield this.super.apply(this, arguments);
		//Console.out('WebServerModule initialize', this.settings);

		// Inspect the settings to see if they want a web server
		var webServersSettings = this.settings.get('webServers');
		if(webServersSettings) {
			var webServerCount = 0;
			yield webServersSettings.each(function*(index, webServerSettingsObject) {
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
				this.webServers[webServerIdentifier] = new WebServer(webServerIdentifier, webServerSettings);
				
				// Start the web server
				yield this.webServers[webServerIdentifier].start();

				webServerCount++;
			}.bind(this));
		}
	},
	
});