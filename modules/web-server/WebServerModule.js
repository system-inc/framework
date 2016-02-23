// Dependencies
var Module = Framework.require('modules/module/Module.js');
var Version = Framework.require('modules/version/Version.js');
var WebServer = Framework.require('modules/web-server/WebServer.js');

// Class
var WebServerModule = Module.extend({

	version: new Version('0.1.0'),

	webServers: {},

	initialize: function*(settings) {
		yield this.super.apply(this, arguments);
		//Console.log('WebServerModule initialize', this.settings);

		yield this.createWebServers();
	},

	createWebServers: function*() {
		// Inspect the settings to see if they want a web server
		var webServersSettings = this.settings.get('webServers');
		if(webServersSettings) {
			var webServerCount = 0;
			yield webServersSettings.each(function*(webServerSettingsObjectIndex, webServerSettingsObject) {
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

				//Console.log('Initializing web server...');

				// Create the web server
				this.webServers[webServerIdentifier] = new WebServer(webServerIdentifier, webServerSettings);
				
				// Start the web server
				yield this.webServers[webServerIdentifier].start();

				webServerCount++;
			}.bind(this));
		}

		return this.webServers;
	},
	
});

// Export
module.exports = WebServerModule;