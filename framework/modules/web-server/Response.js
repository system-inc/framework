Response = Class.extend({

	construct: function(nodeResponse) {
		// Unique identifier for the response
		this.id = null;

		// Add a stopwatch to the response
		this.stopwatch = new Stopwatch();
		
		// Hold onto Node's response object
		this.nodeResponse = nodeResponse;

		// Encodings
		this.encoding = null;
		this.acceptedEncodings = [];

		// Headers
		this.statusCode = null;
		this.cookies = new Cookies();
		this.headers = new Headers();
		this.headers.cookies = this.cookies;

		// Content
		this.content = '';
	},

	setAcceptedEncodings: function(acceptEncodeHeaderString) {
		if(acceptEncodeHeaderString && acceptEncodeHeaderString.isString()) {
			var acceptedEncodings = acceptEncodeHeaderString.split(',');
			for(var i = 0; i < acceptedEncodings.length; i++) {
				this.acceptedEncodings.push(acceptedEncodings[i].trim());
			}

			// Deflate is faster than gzip
			if(this.acceptedEncodings.contains('deflate', false)) {
				this.encoding = 'deflate';
			}
			else if(this.acceptedEncodings.contains('gzip', false)) {
				this.encoding = 'gzip';
			}
		}

		return this.acceptedEncodings;
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

		// Set the content encoding header
		if(this.encoding) {
			this.headers.update('Content-Encoding', this.encoding);
		}

		// Track the elapsed time
		this.stopwatch.end();
		this.headers.create('X-Elapsed-Time-in-'+this.stopwatch.precision.capitalize(), this.stopwatch.elapsedTime);

		this.nodeResponse.writeHead(this.statusCode, this.headers.toArray());
	},

	sendContent: function() {
		var self = this;

		// Deflate
		if(this.encoding == 'deflate') {
			NodeZlib.deflate(new Buffer(this.content, 'utf-8'), function(error, result) {
				self.nodeResponse.end(result);
			});
		}
		// Gzip
		else if(this.encoding = 'gzip') {
			NodeZlib.gzip(new Buffer(this.content, 'utf-8'), function(error, result) {
				self.nodeResponse.end(result);
			});
		}
		// Standard
		else {
			this.nodeResponse.end(this.content);
		}
	},

});