// Dependencies
import { Route } from '@framework/system/server/web/routes/Route.js';
import { NotFoundError } from '@framework/system/server/web/errors/NotFoundError.js';

// Class
class Router {

	routes = [];

	async loadRoutes(routes) {
		//app.log('Loading routes...');

		if(routes) {
			await routes.each(async function(routeSettingsIndex, routeSettings) {
				this.routes.append(await Route.create(routeSettings));
			}.bind(this));
		}

		//app.info('this.routes', this.routes);
	}

	matchRoute(request, response) {
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
	}

	async route(request, response) {
		var route = this.matchRoute(request, response);
		//app.warn('route', route);

		if(route) {
			await route.follow(request, response);
		}
		// Handle no route found
		else {
			// Change this to getting error routes
			throw new NotFoundError(request.method+' '+request.url.input+' did not match any routes.');
		}
	}
	
}

// Export
export { Router };
