Router = Class.extend({

	construct: function() {
		// Load available routes from settings
		this.routes = [];
	},

	matchRoute: function(request) {
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
		//console.log('Route.request:', route.request);

		route.follow(route);
	},
	
});