WebServer = Server.extend({

	requests: 0,
	router: new Router(),
	listeners: {},

	construct: function() {
	},

	listen: function(ports) {
		var self = this;

		// Make sure we are working with an array of ports
		if(!Array.is(ports)) {
			ports = [ports];
		}

		// Create a server for each port they want to listen on
		for(var i = 0; i < ports.length; i++) {
			// If we are already listening on that port
			if(this.listeners[ports[i]]) {
				console.log('Could not create an web server listener on port '+ports[i]+', the port is already in use.');
			}
			// If the port is free
			else {
				// Create the web server
				console.log('Listening on port '+ports[i]+'.');
				this.listeners[ports[i]] = NodeHttp.createServer(function(nodeRequest, nodeResponse) {
					self.handleRequest(new Request(nodeRequest), new Response(nodeResponse));
				});

				// Make the web server listen on the port
				this.listeners[ports[i]].listen(ports[i]);	
			}
		}
	},

	handleRequest: function(request, response) {
		// console.log('');
		// console.log('');
		// console.log('');
		// console.log('');
		// console.log('-- Request -- ');
		// console.log('');

		// Increment the requests counter
		response.id = request.id = this.requests;
		this.requests++;
		console.log('Received request:', request.id, request.url.input);

		// Let the response know what accepted encodings the request allows
		response.setAcceptedEncodings(request.headers.get('accept-encoding'));

		// Identify and follow the route
		this.router.route(request, response);
	},
	
});