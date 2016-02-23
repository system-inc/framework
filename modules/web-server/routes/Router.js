// Dependencies
var RouteFactory = Framework.require('modules/web-server/routes/RouteFactory.js');
var NotFoundError = Framework.require('modules/web-server/errors/NotFoundError.js');

// Class
var Router = Class.extend({

	routes: [],

	loadRoutes: function(routes, project) {
		//Console.log('Loading routes...');

		if(routes) {
			routes.each(function(routeSettingsIndex, routeSettings) {
				this.routes.push(RouteFactory.create(routeSettings));
			}.bind(this));
		}

		//Console.log(this.routes);
	},

	matchRoute: function(request, response) {
		var route = null;

		// Loop over all top level routes
		for(var i = 0; i < this.routes.length; i++) {
			var currentRoute = this.routes[i];
			var currentRouteMatch = currentRoute.match(request, response);

			// If we get a RouteMatch back that has a valid route
			if(currentRouteMatch.route) {
				route = currentRouteMatch.route;
				//Route.log(routeMatch.route, false);
				break;
			}
		}
		
		return route;
	},

	route: function(request, response) {
		var route = this.matchRoute(request, response);
		//Console.log(route);

		// Handle no route found
		if(route) {
			route.follow(request, response);
		}
		else {
			// Change this to getting error routes
			throw new NotFoundError(request.method+' '+request.url.input+' did not match any routes.');
		}
	},
	
});

// Export
module.exports = Router;