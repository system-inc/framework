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
				Console.out('Listening on port '+port+'.');
				this.listeners[port] = NodeHttp.createServer(function(nodeRequest, nodeResponse) {
					// Create Framework request and response objects
					var request = new Request(nodeRequest);
					var response = new Response(nodeResponse, request);

					// Handle the request
					try {
						this.handleRequest(request, response);
					}
					// Send any errors to this.handleError
					catch(error) {
						this.handleError(request, response, error);
					}
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
		
		// Show the request in the console
		var requestsLogEntry = this.prepareRequestsLogEntry(request);
		Console.out(this.identifier+': '+requestsLogEntry);

		// Conditionally log the request
		if(this.logs.requests) {
			this.logs.requests.write(requestsLogEntry+"\n")
		}

		// Use this to troubleshoot race conditions
		//var randomMilliseconds = Number.random(100, 3000);
		//console.log('waiting '+randomMilliseconds+' milliseconds');
		//Function.delay(randomMilliseconds, function() {
		//	this.router.route(request, response);
		//}.bind(this));

		//throw new InternalServerError('Testing!');
		//throw new Error('Testing!');
		
		// Identify and follow the route
		this.router.route(request, response);
	},

	handleError: function(request, response, error) {
		console.log('WebServer.handleError()', error);
		//console.log('Handling error for', request.id);
		response.statusCode = error.code;
		response.content = 'Error!';
		//response.content = 'Error!'+"\n"+error.message;
		response.send();
	},

	prepareRequestsLogEntry: function(request) {
		var requestsLogEntry = '"'+request.id+'","'+request.time.getDateTime()+'","'+request.ipAddress.address+'","'+request.method+'","'+request.url.input+'"';

		return requestsLogEntry;
	},
	
});