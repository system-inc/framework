require('./Controller');
require('./Cookie');
require('./Cookies');
require('./Header');
require('./Headers');
require('./Request');
require('./Response');
require('./Route');
require('./Router');
require('./View');

WebServer = Server.extend({

	construct: function() {
		var self = this;

		this.router = new Router();
		this.requests = 0;

		this.nodeServer = NodeHttp.createServer(function(nodeRequest, nodeResponse) {
			self.handleRequest(new Request(nodeRequest), new Response(nodeResponse));
		});

		this.listen();
	},

	listen: function() {
		this.nodeServer.listen(8080);
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
		//console.log('Received request:', request.id, request.url.path);

		// Let the response know what accepted encodings the request allows
		response.setAcceptedEncodings(request.headers.get('accept-encoding'));

		// Identify and follow the route
		this.router.route(request, response);
	},
	
});