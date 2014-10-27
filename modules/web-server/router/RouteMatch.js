RouteMatch = Class.extend({

	route: null,
	webServer: null,
	request: null,
	response: null,
	partial: false,
	complete: false,
	data: {},
	errors: [],

	setWebServer: function(webServer) {
		this.webServer = webServer;
	},

	setRequest: function(request) {
		this.request = request;
	},

	setResponse: function(response) {
		this.response = response;
	},

	finalizeRouteData: function() {
		var finalizedRouteData = {};

		// Go through each capture group named in the route and its parents and assign the proper key and value for the capture group name and its matches
		var count = 1;
		this.getCaptureGroupNames().each(function(captureGroupName) {
			finalizedRouteData[captureGroupName] = this.complete[count];
			count++;
		}, this);

		// Merge what we have so far with the route data
		finalizedRouteData = this.route.data.merge(finalizedRouteData);

		// Strip out all of the capture group integer keys
		finalizedRouteData.each(function(key, value) {
			if(key.isInteger()) {
				delete finalizedRouteData[key];
			}
		});

		// Merge request.bodyObject into data
		if(this.request.bodyObject) {
			finalizedRouteData = finalizedRouteData.merge(this.request.bodyObject);
		}

		// Sort the data by keys
		finalizedRouteData = finalizedRouteData.sort();

		this.data = finalizedRouteData;
	},

	getCaptureGroupNames: function() {
		var captureGroupNames = [];

		// Make a flattened array of the route and it's parents
		var routeArray = this.route.getParents();
		routeArray.push(this.route);

		routeArray.each(function(route) {
			route.data.each(function(dataKey, dataValue) {
				if(dataKey.isInteger()) {
					captureGroupNames.push(dataValue);
				}
			});
		});

		return captureGroupNames;
	},

	follow: function*() {
		// Finalize route data
		this.finalizeRouteData();

		// Setup a variable to store the content
		var content = null;

		// Route type is controller
		if(this.route.type == 'controller') {
			// Try to get the controller
			var controller = Controller.getController(this.route.controllerName, this.request, this.response, this.route, this.data);

			// If the controller was found, invoke the method for the route
			if(controller) {
				// Use a reflection technique to find the argument names of the controller method and build an arguments array to send in
				var controllerMethodArguments = [];
				var controllerMethodArgumentNames = controller[this.route.controllerMethodName].getArguments();
				controllerMethodArgumentNames.each(function(controllerMethodArgumentName) {
					if(this.data[controllerMethodArgumentName]) {
						controllerMethodArguments.push(this.data[controllerMethodArgumentName]);
					}
					else {
						controllerMethodArguments.push(undefined);
					}
				}, this);

				// Invoke the controller method and pass in the arguments array
				content = yield controller[this.route.controllerMethodName].apply(controller, controllerMethodArguments);
			}
			// Send a 404
			else {
				this.response.statusCode = 404;
				content = this.request.method+' '+this.request.url.path+' not found.';
				content += ' Controller '+this.route.controllerName+' with method '+this.route.controllerMethodName+' does not exist.';
				//TODO: throw new NotFoundError(this.request.url.path+' not found.');
			}
		}
		else if(this.route.type == 'redirect') {
			this.response.statusCode = this.route.redirectStatusCode;
			this.response.headers.set('Location', this.route.redirectLocation);
		}
		else if(this.route.type == 'proxy') {
			
		}
		else if(this.route.type == 'file') {
			// Build the file path
			var path = Project.directory+'views'+this.request.url.path;

			// Check if the file exists
			if(yield File.exists(path)) {
				// Set the Content-Type header
				var contentType = File.getContentType(path);
				this.response.headers.set('Content-Type', contentType);
				
				// Read the file
				var file = yield File.read(path);

				// Set the response content
				content = file;
			}
			// If the file doesn't exist, send a 404
			else {
				this.response.statusCode = 404;
				content = this.request.url.path+' not found.';
				//TODO: throw new NotFoundError(this.request.url.path+' not found.');
			}
		}

		// If content exists, make sure it is a string or a buffer
		if(content && !String.is(content) && !Object.isBuffer(content)) {
			content = Json.encode(content);
		}

		// If content exists, put it on the response
		if(content) {
			this.response.content = content;
		}

		// Send the response
		//Console.out('Sending response:', this.response.id, this.response.content);
		this.response.send();
	}

});