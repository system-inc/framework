WebServer = Server.extend({

	construct: function() {
		var self = this;

		this.router = new Router();

		this.nodeServer = NodeHttp.createServer(function(request, response) {
			self.handleRequest(request, response);
		});

		this.listen();
	},

	listen: function() {
		this.nodeServer.listen(8080);
	},

	handleRequest: function(request, response) {
		//console.log(request, response);
		response.writeHead(200, {
			'Content-Type': 'text/plain'
		});

		for(header in request.headers) {
			response.write(header+': '+request.headers[header]+'\r\n');
		}
		response.end(request.method+' '+request.url);
	},
	
});