WebServer = Server.extend({

	identifier: null,
	requests: 0,
	settings: null,
	router: null,
	listeners: {},
	logs: {
		general: null,
		requests: null,
		responses: null,
	},
	
	construct: function(identifier, settings) {
		this.identifier = identifier;
		this.settings = (settings === undefined ? new Settings() : settings);
		this.settings.default({
			'logs': {
				'general': {
					'enabled': true,
					'directory': Project.directory+'logs/',
					'nameWithoutExtension': 'web-server-'+this.identifier,
				},
				'requests': {
					'enabled': true,
					'directory': Project.directory+'logs/',
					'nameWithoutExtension': 'web-server-'+this.identifier+'-requests',
				},
				'responses': {
					'enabled': true,
					'directory': Project.directory+'logs/',
					'nameWithoutExtension': 'web-server-'+this.identifier+'-responses',
				},
			},
			'serverTimeoutInMilliseconds': 60000, // 60 seconds
			'requestTimeoutInMilliseconds': 5000, // 5 seconds
			'responseTimeoutInMilliseconds': 5000, // 5 seconds
			'maximumRequestBodySizeInBytes': 20000000, // 20 megabytes
		});

		// Conditionally attach the general log
		if(this.settings.get('logs.general.enabled')) {
			this.logs.general = new Log(this.settings.get('logs.general.directory'), this.settings.get('logs.general.nameWithoutExtension'));
		}

		// Conditionally attach the requests log
		if(this.settings.get('logs.requests.enabled')) {
			this.logs.requests = new Log(this.settings.get('logs.requests.directory'), this.settings.get('logs.requests.nameWithoutExtension'));
		}

		// Conditionally attach the responses log
		if(this.settings.get('logs.responses.enabled')) {
			this.logs.responses = new Log(this.settings.get('logs.responses.directory'), this.settings.get('logs.responses.nameWithoutExtension'));
		}
		
		// Load the routes into the router
		this.router = new Router(this);
		this.router.loadRoutes(this.settings.get('router.routes'));

		// Start listening
		this.listen(this.settings.get('ports'));
	},

	listen: function(ports) {
		// Create a listener for each port they want to listen on
		ports.toArray().each(function(port) {
			// If we are already listening on that port
			if(this.listeners[port]) {
				Console.out('Could not create an web server listener on port '+port+', the port is already in use.');
			}
			// If the port is free
			else {
				var nodeServer = NodeHttp.createServer(this.handleRequestConnection.bind(this));

				// Set a timeout on server connections
				nodeServer.setTimeout(this.settings.get('serverTimeoutInMilliseconds'));

				// Create the web server
				this.listeners[port] = nodeServer;

				// Make the web server listen on the port
				this.listeners[port].listen(port);
				Console.out('Listening on port '+port+'.');
			}
		}, this);
	},

	handleRequestConnection: function(nodeRequest, nodeResponse) {
		// Increment the requests counter right away in case of crashes
		this.requests++;

		// Create the request object which wrap node's request object
		try {
			var request = new Request(nodeRequest, this);
			request.id = this.requests - 1; // Subtract one because we already incremented above outside of the try catch
		}
		catch(error) {
			this.handleInternalServerError(error, nodeResponse);
			return;
		}
		
		// Create the response object which wrap node's response object
		try {
			var response = new Response(nodeResponse, request, this);
			response.id = request.id; // Match the responses ID to the request's ID
		}
		catch(error) {
			this.handleInternalServerError(error, nodeResponse, request);
			return;
		}

		// Set a timeout on handling the request
		nodeRequest.setTimeout(this.settings.get('requestTimeoutInMilliseconds'), function(socket) {
			this.handleError(request, response, new InternalServerError('Timed out after '+this.settings.get('requestTimeoutInMilliseconds')+' milliseconds while receiving the request.'));
		}.bind(this));

		// Set a timeout on building the response
		nodeResponse.setTimeout(this.settings.get('responseTimeoutInMilliseconds'), function(socket) {
			this.handleError(request, response, new InternalServerError('Timed out after '+this.settings.get('responseTimeoutInMilliseconds')+' milliseconds while building a response.'));
		}.bind(this));

		// Invoke the generator that handles the request
		this.handleRequest(request, response);
	},

	handleRequest: function*(request, response) {
		try {
			// Mark the request as received
			request.received();

			// Wait for the node request to finish
			var nodeRequest = yield Request.receiveNodeRequest(request, this.settings.get('maximumRequestBodySizeInBytes'));
			nodeRequest.throwIfError();

			// Use this to troubleshoot race conditions
			//var randomMilliseconds = Number.random(100, 3000);
			//console.log('waiting '+randomMilliseconds+' milliseconds');
			//Function.delay(randomMilliseconds, function() {
			//	this.router.route(request, response);
			//}.bind(this));
						
			// Identify and follow the route
			yield this.router.route(request, response);
		}
		catch(error) {
			this.handleError(request, response, error);
		}
	},

	// Handles errors that occur after nodeResponse is wrapped in a Framework response object
	handleError: function(request, response, error) {
		var logEntry = Console.out('WebServer.handleError() called on request '+request.id+'. Error:', error);

		// Mark the response as handled
		response.handled = true;

		// Set the status code
		if(!error.code) {
			response.statusCode = 500;
		}
		else {
			response.statusCode = error.code;
		}

		// Set the content
		response.content = Json.encode({
			errors: [error.toObject()],
			request: request.getPublicErrorData(),
		});

		// Send the response
		response.send(true);

		// Conditionally log the failed request to the general log
		if(this.logs.general) {
			this.logs.general.write(logEntry+"\n");
		}
	},

	// Handles errors that occur before nodeResponse is wrapped in a Framework response object
	handleInternalServerError: function(error, nodeResponse, request) {
		var logEntry = Console.out('WebServer.handleInternalServerError() called. Error:', error);
		nodeResponse.writeHead(500, [['Content-Type', 'application/json']]);

		// Make sure we are working with an error object
		if(error.code != 500) {
			error = new InternalServerError();
		}

		// The content to return in the request
		var content = {
			errors: [error.toObject()],
		};

		// Add request data to the content if we have it
		if(request != undefined) {
			content.request = request.getPublicErrorData();
		}

		// Encode the content
		content = Json.encode(content);

		// Send the content and end the response
		nodeResponse.end(content);

		// Conditionally log the failed request to the general log
		if(this.logs.general) {
			this.logs.general.write(logEntry+"\n");
		}
	},
	
});