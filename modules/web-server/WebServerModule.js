// Dependencies
import Module from './../../system/module/Module.js';
import Version from './../../system/version/Version.js';
import WebServer from './../../system/web-server/WebServer.js';
import Settings from './../../system/settings/Settings.js';

// Class
class WebServerModule extends Module {

	version = new Version('0.1.0');

	webServers = {};

	async initialize(settings) {
		await this.super.apply(this, arguments);
		//Console.log('WebServerModule initialize', this.settings);

		await this.createWebServers();
	}

	async createWebServers() {
		// Inspect the settings to see if they want a web server
		var webServersSettings = this.settings.get('webServers');
		if(webServersSettings) {
			var webServerCount = 0;
			await webServersSettings.each(async function(webServerSettingsObjectIndex, webServerSettingsObject) {
				// Get an instance of class Settings to localize to the web server
				var webServerSettings = new Settings(webServerSettingsObject);
				var webServerIdentifier = webServerSettings.get('identifier');

				// Make sure the web server has an identifier
				if(!webServerIdentifier) {
					webServerIdentifier = app.identifier;
					if(webServerCount > 0) {
						webServerIdentifier += ''+webServerCount;
					}
				}

				//Console.log('Initializing web server...');

				// Create the web server
				this.webServers[webServerIdentifier] = new WebServer(webServerIdentifier, webServerSettings);
				
				// Start the web server
				await this.webServers[webServerIdentifier].start();

				webServerCount++;
			}.bind(this));
		}

		return this.webServers;
	}
	
}

// Export
export default WebServerModule;
