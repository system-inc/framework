Response = Class.extend({

	id: null, // Unique identifier for the response
	request: null,
	webServer: null,
	stopwatch: null,
	nodeResponse: null,

	// Encodings
	encoding: 'identity',
	acceptedEncodings: [],

	// Headers
	statusCode: null,
	headers: null,
	cookies: null,

	// Content
	content: '',

	// Keep track of whether or not the request has been handled (is sending or has been sent)
	handled: false,

	construct: function(nodeResponse, request, webServer) {
		// Hold onto Node's response object
		this.nodeResponse = nodeResponse;

		// Add a stopwatch to the response
		this.stopwatch = new Stopwatch();
		
		// Reference the associated request and and web server
		this.request = request;
		this.webServer = webServer;

		// Instantiate and connect Cookies to Headers
		this.headers = new Headers();
		this.cookies = new Cookies();
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
		// Mark the response as handled
		this.handled = true;

		// Let the response know what accepted encodings the request allows
		this.setAcceptedEncodings(this.request.headers.get('accept-encoding'));

		// Send the headers
		this.sendHeaders();
		this.sendContent();

		// Wrap things up
		this.sent();
	},

	sent: function() {
		// Show the request in the console
		//var requestsLogEntry = 'got one'; //this.webServer.prepareRequestsLogEntry(request);
		//Console.out(this.webServer.identifier+' response: '+requestsLogEntry);

		// Conditionally log the request
		//if(this.logs.requests) {
		//	this.logs.requests.write(requestsLogEntry+"\n")
		//}
	},

	sendHeaders: function() {
		// Default statusCode is 200
		if(!this.statusCode) {
			this.statusCode = 200;
		}

		// Set the content encoding header
		this.headers.update('Content-Encoding', this.encoding);

		// Track the elapsed time
		this.stopwatch.end();
		this.headers.create('X-Processing-Time-in-'+this.stopwatch.precision.capitalize(), this.stopwatch.elapsedTime);

		// Add the response cookies to the headers
		this.headers.addCookies(this.cookies);

		// Write the headers out
		this.nodeResponse.writeHead(this.statusCode, this.headers.toArray());
	},

	sendContent: function*() {
		//console.log(this.content);
		//console.log(this.acceptedEncodings);

		// If the client Accept-Encoding is gzip or deflate
		if(this.encoding == 'gzip' || this.encoding == 'deflate') {
			this.content = yield Data.decode(this.content, this.encoding);
		}

		// End the response
		this.nodeResponse.end(this.content);
	},

});