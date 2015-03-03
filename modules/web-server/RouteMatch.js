RouteMatch = Class.extend({

	route: null,
	webServer: null,
	request: null,
	response: null,
	partial: false,
	complete: false,
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
		this.getCaptureGroupNames().each(function(index, captureGroupName) {
			finalizedRouteData[captureGroupName] = this.complete[count];
			count++;
		}, this);

		// Merge what we have so far with the route data
		finalizedRouteData = this.route.data.clone().merge(finalizedRouteData);

		// Strip out all of the capture group integer keys
		finalizedRouteData.each(function(key, value) {
			if(Number.isInteger(key)) {
				delete finalizedRouteData[key];
			}
		});

		// Merge request.data into data
		if(this.request.data) {
			finalizedRouteData = finalizedRouteData.merge(this.request.data);
		}

		// Sort the data by keys
		finalizedRouteData = finalizedRouteData.sort();

		return finalizedRouteData;
	},

	getCaptureGroupNames: function() {
		var captureGroupNames = [];

		// Make a flattened array of the route and it's parents
		var routeArray = this.route.getParents();
		routeArray.push(this.route);

		routeArray.each(function(index, route) {
			route.data.each(function(dataKey, dataValue) {
				if(Number.isInteger(dataKey)) {
					captureGroupNames.push(dataValue);
				}
			});
		});

		return captureGroupNames;
	},

	follow: function*() {
		// Finalize route data
		var finalizedRouteData = this.finalizeRouteData();

		// Setup a variable to store the content
		var content = null;

		// ControllerRoute
		if(this.route.type == 'controller') {
			// Try to get the controller
			var controller = Controller.getController(this.route.controllerName, this.request, this.response, this.route, finalizedRouteData);

			// If the controller was found, invoke the method for the route
			if(controller && controller[this.route.controllerMethodName]) {
				// Use a reflection technique to find the argument names of the controller method and build an arguments array to send in
				var controllerMethodArguments = [];
				var controllerMethodArgumentNames = controller[this.route.controllerMethodName].getParameters();

				controllerMethodArgumentNames.each(function(index, controllerMethodArgumentName) {
					if(finalizedRouteData[controllerMethodArgumentName]) {
						controllerMethodArguments.push(finalizedRouteData[controllerMethodArgumentName]);
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
				throw new NotFoundError(this.request.method+' '+this.request.url.path+' not found. Controller "'+this.route.controllerName+'" with method "'+this.route.controllerMethodName+'" does not exist.');
			}
		}
		// RedirectRoute
		else if(this.route.type == 'redirect') {
			this.response.statusCode = this.route.redirectStatusCode;

			// If it is a host redirect
			if(this.route.redirectHost) {
				// Clone the request URL
				var url = new Url(this.request.url.input);

				// Replace the host with the desired host
				url.host = this.route.redirectHost;

				//Console.highlight('Redirecting to', url.getUrl());

				// Redirect the client to the URL with the new host
				this.response.headers.set('Location', url.getUrl());
			}
			// If it is a location redirect
			else if(this.route.redirectLocation) {
				// Redirect the client to specific location
				this.response.headers.set('Location', this.route.redirectLocation);
			}
			// If not configured properly
			else {
				throw new InternalServerError('No redirect host or location configured.');
			}
		}
		// ProxyRoute
		else if(this.route.type == 'proxy') {
			// Build a web request for the proxy
			//Console.out(this.route);
			var webRequest = new WebRequest(this.route.getFullProxyUrl(this.request.url).url);
			var webResponse = yield webRequest.execute();
			//Console.out(webResponse);

			this.response.statusCode = webResponse.statusCode;
			this.response.headers = webResponse.headers;
			content = webResponse.body;
		}
		// FileRoute
		else if(this.route.type == 'file') {
			// Build the file path
			var filePath;

			// If the file path is * or not set, use the URL path
			if(this.route.filePath == '*' || Object.isEmpty(this.route.filePath)) {
				filePath = Node.Path.normalize(Project.directory+'views'+this.request.url.path);
			}
			// If a file path is specified, use it
			else if(this.route.filePath) {
				filePath = Node.Path.normalize(Project.directory+'views'+Node.Path.separator+this.route.filePath);
			}

			// Check if the file exists
			if(yield File.exists(filePath)) {
				// Set the Content-Type header
				var contentType = File.getContentType(filePath);
				this.response.headers.set('Content-Type', contentType);
				
				// Read the file
				var file = yield File.read(filePath);

				// Set the response content
				content = file;
			}
			// If the file doesn't exist, send a 404
			else {
				throw new NotFoundError(filePath+' not found.');
			}
		}

		// If content exists, make sure it is a string or a buffer
		if(content && !String.is(content) && !Buffer.is(content)) {
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