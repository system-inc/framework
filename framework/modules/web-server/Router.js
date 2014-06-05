Router = Class.extend({

	construct: function() {
		// Load available routes from settings
		this.routes = [];
	},

	loadRoutes: function(routes, project) {
		//console.log('Loading routes', routes);

		routes.each(function(routeJson) {
			this.routes.push(new Route(routeJson));
		}, this);

		// console.log(this.routes);
		Route.log(this.routes[0]);
	},

	matchRoute: function(request) {
		// ROUTES SHOULD MATCH AGAINST PROTOCOL (HTTP/HTTPS), HOST, PORT, (PATH, and QUERY STRING == expression)
		return this.routes[0];
		//return new Route();
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