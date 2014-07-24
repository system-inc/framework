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
			}
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
		this.router = new Router();
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
				Console.out('Listening on port '+port+'.');
				this.listeners[port] = NodeHttp.createServer(function(nodeRequest, nodeResponse) {
					this.handleRequest(new Request(nodeRequest), new Response(nodeResponse));
				}.bind(this));

				// Make the web server listen on the port
				this.listeners[port].listen(port);
			}
		}, this);
	},

	handleRequest: function(request, response) {
		// Increment the requests counter
		response.id = request.id = this.requests;
		this.requests++;
		
		// Get the requests log entry
		var requestsLogEntry = this.prepareRequestsLogEntry(request);
		Console.out(this.identifier+': '+requestsLogEntry);

		// Conditionally log the request
		if(this.logs.requests) {
			this.logs.requests.write(requestsLogEntry+"\n")
		}		

		// Let the response know what accepted encodings the request allows
		response.setAcceptedEncodings(request.headers.get('accept-encoding'));

		// Identify and follow the route
		try {
			//throw(500);
			this.router.route(request, response);
		}
		catch(exception) {
			this.handleException(request, response, exception);
		}
	},

	handleException: function(request, response, exception) {
		console.log('handling exception!', exception);
		response.statusCode = exception;
		response.content = 'Customize this!';
		response.send();
	},

	prepareRequestsLogEntry: function(request) {
		var requestsLogEntry = '"'+request.id+'","'+request.time.getDateTime()+'","'+request.ipAddress.address+'","'+request.method+'","'+request.url.input+'"';

		return requestsLogEntry;
	},
	
});