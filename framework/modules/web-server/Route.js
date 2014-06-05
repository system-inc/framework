Route = Class.extend({

	request: null,
	response: null,
	parent: null,
	children: [],
	controllerName: null,
	methodName: null,
	redirect: null,
	protocol: null,
	port: null,
	method: null,
	expression: null,
	data: null,
	description: null,

	construct: function(route, parent) {
		this.parent = (parent === undefined ? null : parent);

		if(route) {
			this.controllerName = (route.controllerName === undefined ? null : route.controllerName);
			this.methodName = (route.methodName === undefined ? null : route.methodName);
			this.redirect = (route.redirect === undefined ? null : route.redirect);
			this.protocol = (route.protocol === undefined ? null : route.protocol);
			this.port = (route.port === undefined ? null : route.port);
			this.method = (route.method === undefined ? null : route.method);
			this.expression = (route.expression === undefined ? null : route.expression);
			this.data = (route.data === undefined ? null : route.data);
			this.description = (route.description === undefined ? null : route.description);

			// Inherit parent attributes for null variables
			if(this.parent) {
				this.controllerName = (this.controllerName === null ? parent.controllerName : this.controllerName);
				this.methodName = (this.methodName === null ? parent.methodName : this.methodName);
				this.redirect = (this.redirect === null ? parent.redirect : this.redirect);
				this.protocol = (this.protocol === null ? parent.protocol : this.protocol);
				this.port = (this.port === null ? parent.port : this.port);
				this.method = (this.method === null ? parent.method : this.method);
				this.expression = (this.expression === null ? parent.expression : this.expression);
				this.data = (this.data === null ? parent.data : this.data);
				this.description = (this.description === null ? parent.description : this.description);
			}

			// Create the children if they exist
			if(route.children) {
				route.children.each(function(childRoute) {
					this.children.push(new Route(childRoute, this));
				}, this);
			}
		}
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
		var controller = Controller.getController(this.controllerName, this.request, this.response);

		// If the controller was found, invoke the method for the route
		if(controller) {
			content = yield controller[this.methodName]();
		}
		// Send a 404
		else {
			this.response.statusCode = 404;
			this.response.content = this.controllerName+'.'+this.methodName+' does not exist.';
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

	log: function(route) {
		console.log("------------------------")
		console.log("LEVEL 1 Route:")
		if(route.parent) {
			console.log("Parent:\t", route.parent.controllerName+'.'+route.parent.methodName);
		}
		console.log("Controller name:\t", route.controllerName);
		console.log("Method name:\t\t", route.methodName);
		console.log("Redirect:\t\t", route.redirect);
		console.log("Protocol:\t\t", route.protocol);
		console.log("Port:\t\t\t", route.port);
		console.log("Method:\t\t\t", route.method);
		console.log("Expression:\t\t", route.expression);
		console.log("Data:\t\t\t", route.data);
		console.log("Description:\t\t", route.description);
		if(route.children) {
			console.log("Children:\t\t", route.children.length);	
		}
		
		//Route.log(route.children[0]);

		//this.children[0].log();

		for(var i = 0; i < route.children.length; i++) {
			//route.children[i].log();
			console.log("\t------------------------")
			console.log("\tLEVEL 2 Route:")
			if(route.children[i].parent) {
				console.log("\tParent:\t", route.children[i].parent.expression);	
			}
			console.log("\tController name:\t", route.children[i].controllerName);
			console.log("\tMethod name:\t\t", route.children[i].methodName);
			console.log("\tRedirect:\t\t", route.children[i].redirect);
			console.log("\tProtocol:\t\t", route.children[i].protocol);
			console.log("\tPort:\t\t\t", route.children[i].port);
			console.log("\tMethod:\t\t\t", route.children[i].method);
			console.log("\tExpression:\t\t", route.children[i].expression);
			console.log("\tData:\t\t\t", route.children[i].data);
			console.log("\tDescription:\t\t", route.children[i].description);
			if(route.children[i].children) {
				console.log("\tChildren:\t\t", route.children[i].children.length);	
			}
			
			if(route.children[i].children) {
				for(var k = 0; k < route.children[i].children.length; k++) {
					//route.children[i].log();
					console.log("\t\t------------------------")
					console.log("\t\tLEVEL 3 Route:")
					if(route.children && route.children[i].children && route.children[i].children[k].parent) {
						console.log("\t\tParent:\t", route.children[i].children[k].parent.expression);	
					}
					console.log("\t\tController name:\t", route.children[i].children[k].controllerName);
					console.log("\t\tMethod name:\t\t", route.children[i].children[k].methodName);
					console.log("\t\tRedirect:\t\t", route.children[i].children[k].redirect);
					console.log("\t\tProtocol:\t\t", route.children[i].children[k].protocol);
					console.log("\t\tPort:\t\t\t", route.children[i].children[k].port);
					console.log("\t\tMethod:\t\t\t", route.children[i].children[k].method);
					console.log("\t\tExpression:\t\t", route.children[i].children[k].expression);
					console.log("\t\tData:\t\t\t", route.children[i].children[k].data);
					console.log("\t\tDescription:\t\t", route.children[i].children[k].description);
					if(route.children[i].children[k].children) {
						console.log("\t\tChildren:\t\t", route.children[i].children[k].children.length);	
					}
				}
			}
			
		}
	},
	
});

// Static methods
Route.log = Route.prototype.log;