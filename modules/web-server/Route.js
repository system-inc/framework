Route = Class.extend({
	
	// Type is controller
	controllerName: null,
	controllerMethodName: null,

	// Type is redirect
	redirectStatusCode: null,
	redirectLocation: null,

	// Type is file


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
		this.parent = (parent === undefined ? null : parent);

		if(route) {
			this.type = (route.type === undefined ? null : route.type);
			this.context = (route.context === undefined ? null : route.context);

			// Type is controller
			this.controllerName = (route.controllerName === undefined ? null : route.controllerName);
			this.controllerMethodName = (route.controllerMethodName === undefined ? null : route.controllerMethodName);

			// Type is redirect
			this.redirectStatusCode = (route.redirectStatusCode === undefined ? null : route.redirectStatusCode);
			this.redirectLocation = (route.redirectLocation === undefined ? null : route.redirectLocation);

			// Type is file


			// Any type
			this.protocol = (route.protocol === undefined ? null : route.protocol);
			this.host = (route.host === undefined ? null : route.host);
			this.port = (route.port === undefined ? null : route.port);
			this.method = (route.method === undefined ? null : route.method);
			this.expression = (route.expression === undefined ? null : route.expression);
			this.fullExpression = this.getFullExpression();
			this.data = (route.data === undefined ? this.data : route.data);
			this.description = (route.description === undefined ? null : route.description);

			// Inherit parent attributes
			if(this.parent) {
				this.type = (this.type === null ? parent.type : this.type);
				this.context = (this.context === null ? parent.context : this.context);

				// Type is controller
				if(this.type == 'controller') {
					this.controllerName = (this.controllerName === null ? parent.controllerName : this.controllerName);
					this.controllerMethodName = (this.controllerMethodName === null ? parent.controllerMethodName : this.controllerMethodName);	
				}				

				// Type is redirect
				if(this.type == 'redirect') {
					this.redirectStatusCode = (this.redirectStatusCode === null ? parent.redirectStatusCode : this.redirectStatusCode);
					this.redirectLocation = (this.redirectLocation === null ? parent.redirectLocation : this.redirectLocation);
				}

				// Type is file
				

				// Any type
				this.protocol = (this.protocol === null ? parent.protocol : this.protocol);
				this.host = (this.host === null ? parent.host : this.host);
				this.port = (this.port === null ? parent.port : this.port);
				this.method = (this.method === null ? parent.method : this.method);
				this.expression = (this.expression === null ? parent.expression : this.expression);
				this.description = (this.description === null ? parent.description : this.description);

				// If we have data, merge it with the parent's data object
				if(this.data) {
					this.data = this.data.merge(this.parent.data)	
				}
				// If we do not have any data, just inherit the parent's data
				else {
					this.data = parent.data;
				}
			}

			// Make sure we have a type and context
			if(this.type == null) {
				this.type = 'controller';
			}
			if(this.context == null) {
				this.context = 'project';
			}

			// Create the children if they exist
			if(route.children) {
				route.children.each(function(childRoute) {
					this.children.push(new Route(childRoute, this));
				}, this);
			}
		}
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