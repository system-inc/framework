Router = Class.extend({

	construct: function() {
		// Load available routes from settings
		this.routes = [];
	},

	loadRoutes: function(routes) {
		//console.log('Loading routes', routes);
	},

	matchRoute: function(request) {
		// ROUTES SHOULD MATCH AGAINST PROTOCOL (HTTP/HTTPS), HOST, PORT, PATH, and QUERY STRING

		return new Route();
	},

	route: function(request, response) {
		var route = this.matchRoute();

		// Handle no route found
		if(!route) {
			//route = this.getMissingRoute;
		}

		// Set the request and response
		route.setRequest(request);
		route.setResponse(response);

		route.follow();
	},
	
});