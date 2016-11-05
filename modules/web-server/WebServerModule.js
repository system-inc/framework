// Dependencies
import Module from 'system/module/Module.js';
import Version from 'system/version/Version.js';
import WebServer from 'system/server/web/WebServer.js';
import Settings from 'system/settings/Settings.js';

// Class
class WebServerModule extends Module {

	version = new Version('0.1.0');

	webServers = {};

	async initialize(settings) {
		await super.initialize(...arguments);
		//app.log('WebServerModule initialize', this.settings);

		await this.createWebServers();
	}

	async createWebServers() {
		// Inspect the settings to see if they want a web server
		var webServersSettings = this.settings.get('webServers');
		//app.log('webServersSettings', webServersSettings);

		if(webServersSettings) {
			var webServerCount = 0;
			await webServersSettings.each(async function(webServerSettingsDataIndex, webServerSettingsData) {
				// Get an instance of class Settings to localize to the web server
				var webServerIdentifier = webServerSettingsData.identifier;

				// Make sure the web server has an identifier
				if(!webServerIdentifier) {
					webServerIdentifier = app.identifier;
					if(webServerCount > 0) {
						webServerIdentifier += ''+webServerCount;
					}
				}

				//app.log('Initializing web server...');

				// Create the web server
				this.webServers[webServerIdentifier] = new WebServer(webServerIdentifier, webServerSettingsData);
				
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
