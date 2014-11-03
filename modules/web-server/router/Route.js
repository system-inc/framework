Route = Class.extend({
	
	// Any type
	type: null, // controller, redirect, file, or proxy
	context: null, // project or framework
	protocols: null,
	hosts: null,
	ports: null,
	methods: null,
	expression: null,
	fullExpression: null,
	data: {},
	description: null,
	parent: null,
	children: [],

	construct: function(routeSettings, parent) {
		// Make sure child routes without types are subclassed the same as their parent
		if(!routeSettings.type && parent && parent.type) {
			routeSettings.type = parent.type;
		}

		// Instantiate a subclass of route to handle specific routing behavior (in other words, you can't create a Route, instantiating a new route will always return a subclass of Route)
		var route = null;

		// RedirectRoute
		if(routeSettings.type == 'redirect') {
			route = new RedirectRoute();
			route.inheritProperty('redirectStatusCode', routeSettings, parent);
			route.inheritProperty('redirectHost', routeSettings, parent);
			route.inheritProperty('redirectLocation', routeSettings, parent);
		}
		// FileRoute
		else if(routeSettings.type == 'file') {
			route = new FileRoute();
		}
		// ProxyRoute
		else if(routeSettings.type == 'proxy') {
			route = new ProxyRoute();
			route.inheritProperty('proxyUrl', routeSettings, parent);
			// Make sure we are working with a URL object
			if(route.proxyUrl) {
				route.proxyUrl = new Url(route.proxyUrl);
			}
			route.inheritProperty('proxyHeaders', routeSettings, parent);
		}
		// ControllerRoute is the default subclass
		else {
			route = new ControllerRoute();
			route.inheritProperty('controllerName', routeSettings, parent);
			route.inheritProperty('controllerMethodName', routeSettings, parent);
		}

		// If we have a parent, set it
		route.parent = (parent === undefined ? null : parent);

		// Inherit properties (either from routeSettings or from the parent route)
		route.inheritProperty('context', routeSettings, parent);
		route.inheritProperty('protocols', routeSettings, parent);
		route.inheritProperty('hosts', routeSettings, parent);
		route.inheritProperty('ports', routeSettings, parent);
		route.inheritProperty('methods', routeSettings, parent);
		route.inheritProperty('expression', routeSettings, parent);

		// If we have data in routeSettings, set it
		if(routeSettings.data) {
			route.data = routeSettings.data;
		}

		// If we have a parent, merge our data with the parent's data
		if(route.parent) {
			route.data = Object.clone(route.parent.data).merge(route.data);
		}

		// If we have a description, set it
		if(routeSettings.description) {
			route.description = routeSettings.description;
		}

		// Get and set the fullExpression
		route.fullExpression = route.getFullExpression();

		// Make sure we have a default context of project
		if(route.context == null) {
			route.context = 'project';
		}

		// Create route children if they exist
		if(routeSettings.children) {
			routeSettings.children.each(function(index, childRoute) {
				route.children.push(new Route(childRoute, route));
			}, this);
		}

		return route;
	},

	match: function(request) {
		// Use the RouteMatch data structure to be able to keep track of match meta data without running into concurrency issues that would happen as a result of storing data on the route object
		var routeMatch = new RouteMatch();

		// Check the request's expression against the route's fullExpression
		var requestExpression = request.url.path;
		//Console.out("\n"+'Checking if request expression', requestExpression, 'matches with route full expression', this.fullExpression);

		routeMatch.partial = requestExpression.match(new RegExp(this.fullExpression));
		if(routeMatch.partial) {
			//Console.out('Partially!');
		}
		routeMatch.complete = requestExpression.match(new RegExp('^'+this.fullExpression+'$'));
		if(routeMatch.complete) {
			routeMatch.route = this;
			//Console.out('Completely! Setting match.');
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
			//Console.out('Comparing methods', routeMatch.route.methods, 'against', request.method);
			if(routeMatch.route && routeMatch.route.methods != '*' && !routeMatch.route.methods.contains(request.method)) {
				//Console.out('Method match failed!');
				routeMatch.route = null;
			}

			// Check the protocols
			//Console.out('Comparing protocols', routeMatch.route.protocols, 'against', request.url.protocol);
			if(routeMatch.route && routeMatch.route.protocols != '*' && !routeMatch.route.protocols.contains(request.url.protocol)) {
				//Console.out('Protocol match failed!');
				routeMatch.route = null;
			}

			// Check the host
			//Console.out('Comparing hosts', routeMatch.route.hosts.toArray(), 'against', request.url.host);
			if(routeMatch.route && routeMatch.route.hosts != '*' && !routeMatch.route.hosts.toArray().contains(request.url.host, false, 'either')) {
				//Console.out('Host match failed!');
				routeMatch.route = null;
			}

			// Check the ports
			//Console.out('Comparing ports', routeMatch.route.ports, 'against', request.url.port);
			if(routeMatch.route && routeMatch.route.ports != '*' && !routeMatch.route.ports.contains(request.url.port)) {
				//Console.out('Port match failed!');
				routeMatch.route = null;
			}
			
			// If we do not completely match
			if(routeMatch.route && !routeMatch.complete) {
				//Console.out('We do not have a complete match!');
				routeMatch.route = null;
			}
		}

		return routeMatch;
	},

	inheritProperty: function(propertyName, routeSettings, parent) {
		// If the property is declared in the route settings, set it
		if(routeSettings[propertyName]) {
			this[propertyName] = routeSettings[propertyName];
		}
		
		// If the property is null, inherit the parent's property
		if(!this[propertyName] && parent && parent[propertyName]) {
			this[propertyName] = parent[propertyName];
		}

		return this;
	},

	getFullExpression: function() {
		var fullExpression = '';

		if(this.parent) {
			fullExpression += this.parent.fullExpression;
		}

		fullExpression += this.expression;

		return fullExpression;
	},

	getParents: function() {
		var parents = [];

		var currentParent = this.parent;
		while(currentParent) {
			parents.push(currentParent);
			currentParent = currentParent.parent;
		}

		return parents;
	},
	
});