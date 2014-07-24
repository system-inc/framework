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
		var routeMatch = null;

		for(var i = 0; i < this.routes.length; i++) {
			var currentRoute = this.routes[i];
			currentRouteMatch = currentRoute.match(request);

			// If we get a RouteMatch back that has a valid route
			if(currentRouteMatch.route) {
				routeMatch = currentRouteMatch;
				//Route.log(routeMatch.route, false);
				break;
			}
		}		
		
		return routeMatch;
	},

	route: function(request, response) {
		//throw(501);
		var routeMatch = this.matchRoute(request);
		//Console.out(routeMatch);

		// Handle no route found
		if(!routeMatch) {
			// Change this to getting error routes
			routeMatch = new RouteMatch();
			routeMatch.route = new Route();
		}

		// Set the request and response
		routeMatch.setRequest(request);
		routeMatch.setResponse(response);

		// Follow the route match
		routeMatch.follow();
	},
	
});