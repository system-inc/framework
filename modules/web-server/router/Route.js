Route = Class.extend({
	
	// Any type
	type: null, // controller, redirect, file, or proxy
	context: null, // project or framework
	protocol: null,
	host: null,
	port: null,
	method: null,
	expression: null,
	fullExpression: null,
	data: {},
	description: null,
	parent: null,
	children: [],

	construct: function(route, parent) {
		// Instantiate a subclass of route to handle specific routing behavior
		var routeSubclassToReturn = null;

		// Make sure child routes without types are subclassed the same as their parent
		if(!route.type && parent && parent.type) {
			route.type = parent.type;
		}

		// RedirectRoute
		if(route.type == 'redirect') {
			var redirectStatusCode = (route.redirectStatusCode ? route.redirectStatusCode : (parent && parent.redirectStatusCode ? parent.redirectStatusCode : null));
			var redirectLocation = (route.redirectLocation ? route.redirectLocation : (parent && parent.redirectLocation ? parent.redirectLocation : null));
			routeSubclassToReturn = new RedirectRoute(redirectStatusCode, redirectLocation);
		}
		// FileRoute
		else if(route.type == 'file') {
			routeSubclassToReturn = new FileRoute();
		}
		// ProxyRoute
		else if(route.type == 'proxy') {
			routeSubclassToReturn = new ProxyRoute();
		}
		// ControllerRoute is the default subclass
		else {
			var controllerName = (route.controllerName ? route.controllerName : (parent && parent.controllerName ? parent.controllerName : null));
			var controllerMethodName = (route.controllerMethodName ? route.controllerName : (parent && parent.controllerMethodName ? parent.controllerMethodName : null));
			routeSubclassToReturn = new ControllerRoute(controllerName, controllerMethodName);
		}

		// Set the instance variables
		routeSubclassToReturn.parent = (parent === undefined ? null : parent);
		routeSubclassToReturn.context = (route.context === undefined ? null : route.context);
		routeSubclassToReturn.protocol = (route.protocol === undefined ? null : route.protocol);
		routeSubclassToReturn.host = (route.host === undefined ? null : route.host);
		routeSubclassToReturn.port = (route.port === undefined ? null : route.port);
		routeSubclassToReturn.method = (route.method === undefined ? null : route.method);
		routeSubclassToReturn.expression = (route.expression === undefined ? null : route.expression);
		routeSubclassToReturn.fullExpression = routeSubclassToReturn.getFullExpression();
		routeSubclassToReturn.data = (route.data === undefined ? routeSubclassToReturn.data : route.data);
		routeSubclassToReturn.description = (route.description === undefined ? null : route.description);

		// Inherit parent attributes
		if(routeSubclassToReturn.parent) {
			routeSubclassToReturn.context = (routeSubclassToReturn.context === null ? routeSubclassToReturn.parent.context : routeSubclassToReturn.context);
			routeSubclassToReturn.protocol = (routeSubclassToReturn.protocol === null ? routeSubclassToReturn.parent.protocol : routeSubclassToReturn.protocol);
			routeSubclassToReturn.host = (routeSubclassToReturn.host === null ? routeSubclassToReturn.parent.host : routeSubclassToReturn.host);
			routeSubclassToReturn.port = (routeSubclassToReturn.port === null ? routeSubclassToReturn.parent.port : routeSubclassToReturn.port);
			routeSubclassToReturn.method = (routeSubclassToReturn.method === null ? routeSubclassToReturn.parent.method : routeSubclassToReturn.method);
			routeSubclassToReturn.expression = (routeSubclassToReturn.expression === null ? routeSubclassToReturn.parent.expression : routeSubclassToReturn.expression);
			routeSubclassToReturn.description = (routeSubclassToReturn.description === null ? routeSubclassToReturn.parent.description : routeSubclassToReturn.description);

			// If we have data, merge it with the parent's data object
			if(routeSubclassToReturn.data) {
				routeSubclassToReturn.data = routeSubclassToReturn.data.merge(routeSubclassToReturn.parent.data)	
			}
			// If we do not have any data, just inherit the parent's data
			else {
				routeSubclassToReturn.data = routeSubclassToReturn.parent.data;
			}
		}

		// Make sure we have a context
		if(routeSubclassToReturn.context == null) {
			routeSubclassToReturn.context = 'project';
		}

		// Create the children if they exist
		if(route.children) {
			route.children.each(function(childRoute) {
				routeSubclassToReturn.children.push(new Route(childRoute, routeSubclassToReturn));
			}, this);
		}

		return routeSubclassToReturn;
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
			// Check the method
			//Console.out('Comparing method '+routeMatch.method+' against '+request.method+'.');
			if(routeMatch.route && routeMatch.route.method != '*' && !routeMatch.route.method.contains(request.method)) {
				//Console.out('Method match failed!');
				routeMatch.route = null;
			}

			// Check the protocol
			//Console.out('Comparing protocol '+routeMatch.protocol+' against '+request.url.protocol+'.');
			if(routeMatch.route && routeMatch.route.protocol != '*' && !request.url.protocol.contains(routeMatch.route.protocol)) {
				//Console.out('Protocol match failed!');
				routeMatch.route = null;
			}

			// Check the host
			//Console.out('Comparing host '+request.url.host+' against '+routeMatch.host+'.');
			if(routeMatch.route && routeMatch.route.host != '*' && !request.url.host.match(new RegExp('^'+routeMatch.route.host+'$'))) {
				//Console.out('Host match failed!');
				routeMatch.route = null;
			}

			// Check the port
			//Console.out('Comparing port '+routeMatch.port+' against '+request.url.port+'.');
			if(routeMatch.route && routeMatch.route.port != '*' && !routeMatch.route.port.contains(request.url.port)) {
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

	log: function(route, children, level) {
		level = (level === undefined ? 0 : level);
		children = (children === undefined ? true : false);

		var indent = '';
		for(var i = 0; i < level; i++) {
			indent += "\t";
		}

		Console.out(indent+"------------------------")
		Console.out(indent+"Type:\t\t\t", route.type);
		Console.out(indent+"Context:\t\t", route.context);
		Console.out(indent+"Invoke:\t\t\t", route.controllerName+'.'+route.controllerMethodName);
		Console.out(indent+"Controller name:\t", route.controllerName);
		Console.out(indent+"Method name:\t\t", route.controllerMethodName);
		Console.out(indent+"Redirect status code:\t", route.redirectStatusCode);
		Console.out(indent+"Redirect location:\t", route.redirectLocation);
		Console.out(indent+"Protocol:\t\t", route.protocol);
		Console.out(indent+"Host:\t\t\t", route.host);
		Console.out(indent+"Port:\t\t\t", route.port);
		Console.out(indent+"Method:\t\t\t", route.method);
		Console.out(indent+"Expression:\t\t", route.expression);
		Console.out(indent+"Full expression:\t", route.fullExpression);
		Console.out(indent+"Data:\t\t\t", route.data);
		Console.out(indent+"Description:\t\t", route.description);
		if(route.parent) {
			Console.out(indent+"Parent:\t\t\t", route.parent.controllerName+'.'+route.parent.controllerMethodName);
		}
		else {
			Console.out(indent+"Parent:\t\t\t", 'null');
		}
		if(route.children) {
			Console.out(indent+"Children:\t\t", route.children.length);	
		}

		if(children) {
			route.children.each(function(childRoute) {
				Route.log(childRoute, children, level + 1);
			});	
		}
	},
	
});

// Static methods
Route.log = Route.prototype.log;