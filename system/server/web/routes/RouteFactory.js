import RedirectRoute from './RedirectRoute.js';
import FileRoute from './FileRoute.js';
import ProxyRoute from './ProxyRoute.js';
import ControllerRoute from './ControllerRoute.js';

// Class
class RouteFactory {

	static create(settings, parent) {
		var route = null;

		// Make sure child routes without types are subclassed the same as their parent
		if(!settings.type && parent && parent.type) {
			settings.type = parent.type;
		}

		// RedirectRoute
		if(settings.type == 'redirect') {
			route = new RedirectRoute(settings, parent);
		}
		// FileRoute
		else if(settings.type == 'file') {
			route = new FileRoute(settings, parent);
		}
		// ProxyRoute
		else if(settings.type == 'proxy') {
			route = new ProxyRoute(settings, parent);
		}
		// ControllerRoute is the default subclass
		else {
			route = new ControllerRoute(settings, parent);
		}

		// Create children routes
		route.createChildrenRoutes(settings);

		return route;
	}

}

// Export
export default RouteFactory;
