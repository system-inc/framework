WebServer = Server.extend({

	construct: function() {
		var self = this;

		this.nodeServer = NodeHttp.createServer(function(request, response) {
			self.handleRequest(request, response);
		});

		this.listen();
	},

	listen: function() {
		this.nodeServer.listen(8080);
	},

	handleRequest: function(request, response) {
		console.log(request, response);
		response.writeHead(200, {
			'Content-Type': 'text/plain'
		});
		response.end('seth is gay!');
	},
	
});