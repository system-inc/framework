Router = Class.extend({

	routes: [],

	construct: function() {
		// TODO Load available routes from settings
	},

	loadRoutes: function(routes, project) {
		routes.each(function(routeJson) {
			this.routes.push(new Route(routeJson));
		}, this);

		//Route.log(this.routes[0]);
	},

	matchRoute: function(request) {
		var route = null;

		for(var i = 0; i < this.routes.length; i++) {
			var currentRoute = this.routes[i];

			route = currentRoute.match(request);

			if(route) {
				break;
			}
		}

		// TODO: Setup 404 route
		if(!route) {
			route = new Route();
		}

		console.log('Got route!');
		Route.log(route, false);
		
		return route;
	},

	route: function(request, response) {
		var route = this.matchRoute(request);

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