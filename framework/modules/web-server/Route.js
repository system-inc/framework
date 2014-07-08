Route = Class.extend({

	request: null,
	response: null,
	parent: null,
	children: [],
	controllerName: null,
	methodName: null,
	redirect: null,
	protocol: null,
	host: null,
	port: null,
	method: null,
	expression: null,
	fullExpression: null,
	data: null,
	description: null,

	construct: function(route, parent) {
		this.parent = (parent === undefined ? null : parent);

		if(route) {
			this.controllerName = (route.controllerName === undefined ? null : route.controllerName);
			this.methodName = (route.methodName === undefined ? null : route.methodName);
			this.redirect = (route.redirect === undefined ? null : route.redirect);
			this.protocol = (route.protocol === undefined ? null : route.protocol);
			this.host = (route.host === undefined ? null : route.host);
			this.port = (route.port === undefined ? null : route.port);
			this.method = (route.method === undefined ? null : route.method);
			this.expression = (route.expression === undefined ? null : route.expression);
			this.fullExpression = this.getFullExpression();
			this.data = (route.data === undefined ? {} : route.data);
			this.description = (route.description === undefined ? null : route.description);

			// Inherit parent attributes
			if(this.parent) {
				this.controllerName = (this.controllerName === null ? parent.controllerName : this.controllerName);
				this.methodName = (this.methodName === null ? parent.methodName : this.methodName);
				this.redirect = (this.redirect === null ? parent.redirect : this.redirect);
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

			// Create the children if they exist
			if(route.children) {
				route.children.each(function(childRoute) {
					this.children.push(new Route(childRoute, this));
				}, this);
			}
		}
	},

	match: function(request) {
		var match = null;
		this.matches = {
			'partial': false,
			'complete': false,
		};

		// Check the request's expression against the route's fullExpression
		var requestExpression = request.url.path;
		console.log("\n"+'Checking if request expression', requestExpression, 'matches with route full expression', this.fullExpression);

		this.matches.partial = requestExpression.match(new RegExp(this.fullExpression));
		if(this.matches.partial) {
			console.log('Partially!');
		}
		this.matches.complete = requestExpression.match(new RegExp('^'+this.fullExpression+'$'));
		if(this.matches.complete) {
			match = this;
			console.log('Completely - setting match');
		}

		// If we have a partial match (the match may be complete as well)
		if(this.matches.partial) {
			// Go through all of the children and see if we have a partial or complete match
			var childRouteMatch = null;
			for(var i = 0; i < this.children.length; i++) {
				// Set the current child route
				var currentChildRoute = this.children[i];
				var currentChildRouteMatch = currentChildRoute.match(request);

				// If we have a match
				if(currentChildRouteMatch) {
					match = currentChildRouteMatch;
					break;
				}
			}
		}

		// If we have a match
		if(match) {
			// Check the method
			//console.log('Comparing method '+match.method+' against '+request.method+'.');
			if(match && match.method != '*' && !match.method.contains(request.method)) {
				console.log('Method match failed!');
				match = null;
			}

			// Check the protocol
			//console.log('Comparing protocol '+match.protocol+' against '+request.url.protocol+'.');
			if(match && match.protocol != '*' && !request.url.protocol.contains(match.protocol)) {
				console.log('Protocol match failed!');
				match = null;
			}

			// Check the host
			//console.log('Comparing host '+request.url.host+' against '+match.host+'.');
			if(match && match.host != '*' && !request.url.host.match(new RegExp('^'+match.host+'$'))) {
				console.log('Host match failed!');
				match = null;
			}

			// Check the port
			//console.log('Comparing port '+match.port+' against '+request.url.port+'.');
			if(match && match.port != '*' && !match.port.contains(request.url.port)) {
				console.log('Port match failed!');
				match = null;
			}
			
			// If we do not completely match
			if(match && !match.matches.complete) {
				console.log('We do not have a complete match!');
				match = null;
			}
		}

		return match;
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

	setRequest: function(request) {
		this.request = request;
	},

	setResponse: function(response) {
		this.response = response;
	},

	follow: function*() {
		// Setup a variable to store the content
		var content = null;

		// Try to get the controller
		var controller = Controller.getController(this.controllerName, this.request, this.response, this);

		// If the controller was found, invoke the method for the route
		if(controller) {
			content = yield controller[this.methodName]();
		}
		// Send a 404
		else {
			this.response.statusCode = 404;
			this.response.content = this.request.method+' '+this.request.url.path+' not found.';
			this.response.content += ' Controller '+this.controllerName+' with method '+this.methodName+' does not exist.';
		}

		// If content exists, make sure it is a string
		if(content && !content.isString()) {
			content = content.toString();
		}

		// If content exists, put it on the response
		if(content) {
			this.response.content = content;
		}

		// Send the response
		//console.log('Sending response:', this.response.id, this.response.content);
		this.response.send();
	},

	log: function(route, children, level) {
		level = (level === undefined ? 0 : level);
		children = (children === undefined ? true : false);

		var indent = '';
		for(var i = 0; i < level; i++) {
			indent += "\t";
		}

		console.log(indent+"------------------------")
		console.log(indent+"Invoke:\t\t\t", route.controllerName+'.'+route.methodName);
		console.log(indent+"Controller name:\t", route.controllerName);
		console.log(indent+"Method name:\t\t", route.methodName);
		console.log(indent+"Redirect:\t\t", route.redirect);
		console.log(indent+"Protocol:\t\t", route.protocol);
		console.log(indent+"Host:\t\t\t", route.host);
		console.log(indent+"Port:\t\t\t", route.port);
		console.log(indent+"Method:\t\t\t", route.method);
		console.log(indent+"Expression:\t\t", route.expression);
		console.log(indent+"Full expression:\t", route.fullExpression);
		console.log(indent+"Data:\t\t\t", route.data);
		console.log(indent+"Description:\t\t", route.description);
		if(route.parent) {
			console.log(indent+"Parent:\t\t\t", route.parent.controllerName+'.'+route.parent.methodName);
		}
		else {
			console.log(indent+"Parent:\t\t\t", 'null');
		}
		if(route.children) {
			console.log(indent+"Children:\t\t", route.children.length);	
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