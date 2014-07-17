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
	webServer: null,

	construct: function(settings) {
		this.parent(settings);

		// Inspect the settings to see if they want a web server
		if(!this.settings.isEmpty()) {
			// Create a web server if we need one and don't have one already
			if(!this.webServer) {
				this.webServer = new WebServer();		
			}

			// Listen on the ports specified
			this.webServer.listen(this.settings.get('ports'));

			// Load the project's routes in the web server's router
			this.webServer.router.loadRoutes(this.settings.get('router.routes'));
		}
	},
	
});