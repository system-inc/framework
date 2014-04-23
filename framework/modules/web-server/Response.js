Response = Class.extend({

	construct: function(nodeResponse) {
		// Add a stopwatch to the response
		this.stopwatch = new Stopwatch();
		
		// Hold onto Node's response object
		this.nodeResponse = nodeResponse;

		// Headers
		this.statusCode = null;
		this.cookies = new Cookies();
		this.headers = new Headers();
		this.headers.cookies = this.cookies;

		// Content
		this.content = null;
	},

	send: function() {
		this.sendHeaders();
		this.sendContent();
	},

	sendHeaders: function() {
		// Default statusCode is 200
		if(!this.statusCode) {
			this.statusCode = 200;
		}

		// Track the elapsed time
		this.stopwatch.end();
		this.headers.create('X-Elapsed-Time-in-'+this.stopwatch.precision.capitalize(), this.stopwatch.elapsedTime);

		this.nodeResponse.writeHead(this.statusCode, this.headers.toArray());
	},

	sendContent: function() {
		this.nodeResponse.end(this.content);
	},

});