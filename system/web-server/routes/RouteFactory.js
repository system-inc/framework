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
			var RedirectRoute = Framework.require('system/web-server/routes/RedirectRoute.js');
			route = new RedirectRoute(settings, parent);
		}
		// FileRoute
		else if(settings.type == 'file') {
			var FileRoute = Framework.require('system/web-server/routes/FileRoute.js');
			route = new FileRoute(settings, parent);
		}
		// ProxyRoute
		else if(settings.type == 'proxy') {
			var ProxyRoute = Framework.require('system/web-server/routes/ProxyRoute.js');
			route = new ProxyRoute(settings, parent);
		}
		// ControllerRoute is the default subclass
		else {
			var ControllerRoute = Framework.require('system/web-server/routes/ControllerRoute.js');
			route = new ControllerRoute(settings, parent);
		}

		return route;
	}

}

// Export
export default RouteFactory;
