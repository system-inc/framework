WebServer = Server.extend({

	requests: 0,
	router: new Router(),
	listeners: {},

	construct: function() {
	},

	listen: function(ports) {
		// Create a server for each port they want to listen on
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
		// Log.log('');
		// Log.log('');
		// Log.log('');
		// Log.log('');
		// Log.log('-- Request -- ');
		// Log.log('');

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