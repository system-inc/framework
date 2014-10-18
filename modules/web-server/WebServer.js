WebServer = Server.extend({

	identifier: null,
	requests: 0,
	settings: null,
	router: null,
	listeners: {},
	logs: {
		general: null,
		requests: null,
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
			},
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
				// Create the web server
				this.listeners[port] = NodeHttp.createServer(this.handleRequestConnection.bind(this));

				// Make the web server listen on the port
				this.listeners[port].listen(port);
				Console.out('Listening on port '+port+'.');
			}
		}, this);
	},

	handleRequestConnection: function(nodeRequest, nodeResponse) {
		// Set a timeout on building the response
		nodeResponse.setTimeout(this.settings.get('responseTimeoutInMilliseconds'), function() {
			this.handleInternalServerError(new InternalServerError('Timed out after '+this.settings.get('responseTimeoutInMilliseconds')+' milliseconds while building a response.'), nodeResponse);
		}.bind(this));

		try {
			// Create the request and response objects which wrap node's request and response objects
			var request = new Request(nodeRequest);
			var response = new Response(nodeResponse, request, this);
		}
		catch(error) {
			this.handleInternalServerError(error, nodeResponse);
		}

		// Set the request and response id's and increment the requests counter
		response.id = request.id = this.requests;
		this.requests++;

		// Invoke the generator that handles the request
		this.handleRequest(request, response);
	},

	handleRequest: function*(request, response) {
		try {
			// Show the request in the console
			var requestsLogEntry = this.prepareRequestsLogEntry(request);
			Console.out(this.identifier+' request: '+requestsLogEntry);

			// Conditionally log the request
			if(this.logs.requests) {
				this.logs.requests.write(requestsLogEntry+"\n")
			}

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
		Console.out('WebServer.handleError() called on '+request.id+'. Error:', error);

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
		});

		// Send the response
		response.send();
	},

	// Handles errors that occur before nodeResponse is wrapped in a Framework response object
	handleInternalServerError: function(error, nodeResponse) {
		Console.out('WebServer.handleInternalServerError() called. Error:', error);
		nodeResponse.writeHead(500, [['Content-Type', 'application/json']]);

		if(error.code != 500) {
			error = new InternalServerError();
		}

		nodeResponse.end(Json.encode({'errors':[error.toObject()]}));
	},

	prepareRequestsLogEntry: function(request) {
		var requestsLogEntry = '"'+request.id+'","'+request.time.getDateTime()+'","'+request.ipAddress.address+'","'+request.method+'","'+request.url.input+'"';

		return requestsLogEntry;
	},
	
});