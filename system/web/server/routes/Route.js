// Class
class Route {
	
	// Any type
	type = null; // controller, redirect, file, or proxy
	context = null; // app or framework
	protocols = null;
	hosts = null;
	ports = null;
	methods = null;
	expression = null;
	fullExpression = null;
	data = {};
	capturedData = null;
	description = null;
	parent = null;
	children = [];

	constructor(settings, parent = null) {
		this.parent = parent;

		// Inherit properties (either from settings or from the parent route)
		this.inheritProperty('context', settings, parent);
		this.inheritProperty('protocols', settings, parent);
		this.inheritProperty('hosts', settings, parent);
		this.inheritProperty('ports', settings, parent);
		this.inheritProperty('methods', settings, parent);
		this.inheritProperty('expression', settings, parent);

		// If we have data in settings, set it
		if(settings.data) {
			this.data = settings.data;
		}

		// If we have a parent, merge our data with the parent's data
		if(this.parent) {
			this.data = Object.clone(this.parent.data).merge(this.data);
		}

		// If we have a description, set it
		if(settings.description) {
			this.description = settings.description;
		}

		// Get and set the fullExpression
		this.fullExpression = this.getFullExpression();

		// Make sure we have a default context of app
		if(this.context == null) {
			this.context = 'app';
		}

		// Make sure we have default methods
		if(this.methods == null) {
			this.methods = '*';
		}

		// Make sure we have default protocols
		if(this.protocols == null) {
			this.protocols = '*';
		}

		// Make sure we have default hosts
		if(this.hosts == null) {
			this.hosts = '*';
		}

		// Make sure we have default ports
		if(this.ports == null) {
			this.ports = '*';
		}
	}

	async createChildrenRoutes(settings) {
		// Create route children if they exist
		if(settings.children) {
			await settings.children.each(async function(index, childRouteSettings) {
				this.children.append(await Route.create(childRouteSettings, this));
			}.bind(this));
		}
	}

	inheritProperty(propertyName, settings, parent) {
		// If the property is declared in the route settings, set it
		if(settings[propertyName] !== undefined) {
			this[propertyName] = settings[propertyName];
		}
		
		// If the property is null, inherit the parent's property
		if(this[propertyName] === null && parent && parent[propertyName] !== null) {
			this[propertyName] = parent[propertyName];
		}

		return this;
	}

	match(request, response) {
		// Use the routeMatch data structure to be able to keep track of match meta data without running into concurrency issues that would happen as a result of storing data on the route object
		var routeMatch = {
			route: null, // Will be populated on complete matches
			partial: null,
			complete: null,
		};

		// Check the request's expression against the route's fullExpression
		var requestExpression = request.url.path;
		//app.log("\n"+'Checking if request expression', requestExpression, 'matches with route full expression', this.fullExpression);

		routeMatch.partial = requestExpression.match(new RegularExpression(this.fullExpression));
		if(routeMatch.partial) {
			//app.log('Partially!');
		}
		routeMatch.complete = requestExpression.match(new RegularExpression('^'+this.fullExpression+'$'));
		if(routeMatch.complete) {
			routeMatch.route = this;
			this.capturedData = routeMatch.complete;
			//app.log('Completely! Setting match.');
		}

		// If we have a partial match (the match may be complete as well)
		if(routeMatch.partial) {
			// Go through all of the children and see if we have a partial or complete match
			var childRouteMatch = null;
			for(var i = 0; i < this.children.length; i++) {
				// Set the current child route
				var currentChildRoute = this.children[i];
				var currentChildRouteMatch = currentChildRoute.match(request);

				// If we have a match
				if(currentChildRouteMatch.route) {
					routeMatch = currentChildRouteMatch;
					break;
				}
			}
		}

		// If we have a match
		if(routeMatch.route) {
			// Check the methods
			//app.log('Comparing methods', routeMatch.route.methods, 'against', request.method);
			if(routeMatch.route && routeMatch.route.methods != '*' && !routeMatch.route.methods.contains(request.method)) {
				//app.log('Method match failed!');
				routeMatch.route = null;
			}

			// Check the protocols
			//app.log('Comparing protocols', routeMatch.route.protocols, 'against', request.url.protocol);
			if(routeMatch.route && routeMatch.route.protocols != '*' && !routeMatch.route.protocols.contains(request.url.protocol)) {
				//app.log('Protocol match failed!');
				routeMatch.route = null;
			}

			// Check the host
			//app.log('Comparing hosts', routeMatch.route.hosts.toArray(), 'against', request.url.host);
			if(routeMatch.route && routeMatch.route.hosts != '*' && !routeMatch.route.hosts.toArray().contains(request.url.host, false, 'either')) {
				//app.log('Host match failed!');
				routeMatch.route = null;
			}

			// Check the ports
			//app.log('Comparing ports', routeMatch.route.ports, 'against', request.url.port);
			if(routeMatch.route && routeMatch.route.ports != '*' && !routeMatch.route.ports.contains(request.url.port)) {
				//app.log('Port match failed!');
				routeMatch.route = null;
			}
			
			// If we do not completely match
			if(routeMatch.route && !routeMatch.complete) {
				//app.log('We do not have a complete match!');
				routeMatch.route = null;
			}
		}

		return routeMatch;
	}

	async follow(request, response) {
		// Send the response
		await response.send();
	}

	getFullExpression() {
		var fullExpression = '';

		if(this.parent) {
			fullExpression += this.parent.fullExpression;
		}

		fullExpression += this.expression;

		return fullExpression;
	}

	getParents() {
		var parents = [];

		var currentParent = this.parent;
		while(currentParent) {
			parents.append(currentParent);
			currentParent = currentParent.parent;
		}

		return parents;
	}

	collectData(request) {
		var collectedData = {};

		// Go through each capture group named in the route and its parents and assign the proper key and value for the capture group name and its matches
		var count = 1;
		this.getCaptureGroupNames().each(function(index, captureGroupName) {
			collectedData[captureGroupName] = this.capturedData[count];
			count++;
		}.bind(this));
		//app.exit(collectedData);

		// Merge what we have so far with the route data
		collectedData = this.data.clone().merge(collectedData);

		// Strip out all of the capture group integer keys
		collectedData.each(function(key, value) {
			if(Number.isInteger(key)) {
				delete collectedData[key];
			}
		});

		// Merge request.data into data
		collectedData = collectedData.merge(request.data);

		// Sort the data by keys
		collectedData = collectedData.sort();

		return collectedData;
	}

	getCaptureGroupNames() {
		var captureGroupNames = [];

		// Make a flattened array of the route and it's parents
		var routeArray = this.getParents();
		routeArray.append(this);

		routeArray.each(function(index, route) {
			route.data.each(function(dataKey, dataValue) {
				if(Number.isInteger(dataKey)) {
					captureGroupNames.append(dataValue);
				}
			});
		});

		return captureGroupNames;
	}

	static async create(settings, parent) {
		var route = null;

		// Make sure child routes without types are subclassed the same as their parent
		if(!settings.type && parent && parent.type) {
			settings.type = parent.type;
		}

		// RedirectRoute
		if(settings.type == 'redirect') {
			const { RedirectRoute } = await import('@framework/system/web/server/routes/RedirectRoute.js');
			route = new RedirectRoute(settings, parent);
		}
		// FileRoute
		else if(settings.type == 'file') {
			const { FileRoute } = await import('@framework/system/web/server/routes/FileRoute.js');
			route = new FileRoute(settings, parent);
		}
		// ProxyRoute
		else if(settings.type == 'proxy') {
			const { ProxyRoute } = await import('@framework/system/web/server/routes/ProxyRoute.js');
			route = new ProxyRoute(settings, parent);
		}
		// ControllerRoute is the default subclass
		else {
			const { ControllerRoute } = await import('@framework/system/web/server/routes/ControllerRoute.js');
			route = new ControllerRoute(settings, parent);
		}

		// Create children routes
		await route.createChildrenRoutes(settings);

		return route;
	}
	
}

// Export
export { Route };
