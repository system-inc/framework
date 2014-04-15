require('./Browser');
require('./Device');
require('./OperatingSystem');
require('./Router');
require('./Request');
require('./Url');

WebServer = Server.extend({

	construct: function() {
		var self = this;

		this.router = new Router();

		this.nodeServer = NodeHttp.createServer(function(nodeRequest, nodeResponse) {
			self.handleRequest(new Request(nodeRequest), nodeResponse);
		});

		this.listen();
	},

	listen: function() {
		this.nodeServer.listen(81);
	},

	handleRequest: function(request, nodeResponse) {
		// Identify the route
		//var route = this.router.getRoute();

		nodeResponse.writeHead(200, {
			'Set-Cookie': 'cookie=cookie',
		});
		nodeResponse.end(request.toString());
	},
	
});