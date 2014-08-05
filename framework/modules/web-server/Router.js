Router = Class.extend({

	webServer: null,
	routes: [],

	construct: function(webServer) {
		this.webServer = webServer;
	},

	loadRoutes: function(routes, project) {
		Console.out('Loading routes...')

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
		//throw new Error(500);

		var routeMatch = this.matchRoute(request);
		//Console.out(routeMatch);

		// Handle no route found
		if(!routeMatch) {
			// Change this to getting error routes
			routeMatch = new RouteMatch();
			routeMatch.route = new Route();
		}

		// Set the web server, the request, and the response
		routeMatch.setWebServer(this.webServer);
		routeMatch.setRequest(request);
		routeMatch.setResponse(response);

		// Follow the route match
		routeMatch.follow();
	},
	
});