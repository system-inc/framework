require('./Controllers');
require('./Controller');
require('./Browser');
require('./Device');
require('./OperatingSystem');
require('./Router');
require('./Route');
require('./Request');
require('./Response');
require('./Url');
require('./Version');
require('./IpAddress');
require('./Stopwatch');
require('./Geolocation');
require('./Cookies');
require('./Cookie');
require('./Headers');
require('./Header');

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
		// Increment the requests counter
		this.requests++;
		//console.log(this.requests, request.url.path);

		// Identify and follow the route
		this.router.route(request, response);
	},
	
});