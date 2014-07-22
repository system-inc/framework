WebServer = Server.extend({

	identifier: null,
	requests: 0,
	settings: null,
	router: null,
	listeners: {},
	
	construct: function(settings) {
		this.settings = Settings.constructFromObject(settings);
		
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
				Log.log('Could not create an web server listener on port '+port+', the port is already in use.');
			}
			// If the port is free
			else {
				// Create the web server
				Log.log('Listening on port '+port+'.');
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
		Log.log('Received request', request.id+':', request.method, request.url.input);

		// Let the response know what accepted encodings the request allows
		response.setAcceptedEncodings(request.headers.get('accept-encoding'));

		// Identify and follow the route
		this.router.route(request, response);
	},
	
});