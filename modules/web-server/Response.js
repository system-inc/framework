Response = Class.extend({

	id: null, // Unique identifier for the response
	request: null,
	webServer: null,
	stopwatch: null,
	nodeResponse: null,

	// Encodings
	encoding: 'identity',
	acceptedEncodings: [],
	contentEncoded: false,

	// Headers
	statusCode: null,
	headers: new Headers(),
	cookies: new Cookies(),

	// Content
	content: '',

	// Keep track of whether or not the request has been handled (is sending or has been sent)
	handled: false,

	// The time the request is completely sent
	time: null,

	construct: function(nodeResponse, request, webServer) {
		// Hold onto Node's response object
		this.nodeResponse = nodeResponse;

		// Add a stopwatch to the response
		this.stopwatch = new Stopwatch();
		
		// Reference the associated request and and web server
		this.request = request;
		this.webServer = webServer;
	},

	setAcceptedEncodings: function(acceptEncodeHeaderString) {
		if(acceptEncodeHeaderString && String.is(acceptEncodeHeaderString)) {
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

	send: function(evenIfHandled) {
		// Don't send the request if it is already handled unless forced
		if(this.handled && !evenIfHandled) {
			return;
		}

		// Mark the response as handled
		this.handled = true;

		// If the Content-Encoding header is already set, use it (this is used for proxying requests)
		var contentEncodingHeaderValue = this.headers.get('Content-Encoding');
		if(contentEncodingHeaderValue) {
			this.encoding = contentEncodingHeaderValue;

			// Mark the content as already encoded (if we already have set a content encoding than the content must be encoded already)
			this.contentEncoded = true;
		}
		// If the Content-Encoding header is not set, set the best encoding method based on what the user said they will accept
		else {
			// Let the response know what accepted encodings the request allows
			this.setAcceptedEncodings(this.request.headers.get('accept-encoding'));
		}

		// Send the headers
		this.sendHeaders();
		this.sendContent();

		// Wrap things up
		this.sent();
	},

	sendHeaders: function() {
		// Default statusCode is 200
		if(!this.statusCode) {
			this.statusCode = 200;
		}

		// Set the content encoding header
		this.headers.update('Content-Encoding', this.encoding);

		// Track the elapsed time
		this.stopwatch.stop();
		this.headers.create('X-Processing-Time-in-'+this.stopwatch.precision.capitalize(), this.stopwatch.elapsedTime);

		// Add the response cookies to the headers
		this.headers.addCookies(this.cookies);

		// Write the headers out
		this.nodeResponse.writeHead(this.statusCode, this.headers.toArray());

		//Console.highlight(this.headers.toArray());
	},

	sendContent: function*() {
		//Console.out(this.content);
		//Console.out(this.acceptedEncodings);
		//Console.out('contentEncoded', this.contentEncoded);

		// If we need to encode the content
		if(!this.contentEncoded) {
			// If the client Accept-Encoding is gzip or deflate
			if(this.encoding == 'gzip' || this.encoding == 'deflate') {
				this.content = yield Data.encode(this.content, this.encoding);
			}
			//console.log(this.content);
		}
		
		// End the response
		this.nodeResponse.end(this.content);
	},

	sent: function() {
		this.time = new Time();

		// Show the request in the console
		var responsesLogEntry = this.prepareLogEntry();
		Console.out(this.webServer.identifier+' response: '+responsesLogEntry);

		// Conditionally log the request
		if(this.webServer.logs.responses) {
			this.webServer.logs.responses.write(responsesLogEntry+"\n")
		}
	},

	prepareLogEntry: function() {
		var responsesLogEntry = '';

		responsesLogEntry += '"'+this.id+'"';
		responsesLogEntry += ',"'+this.time.getDateTime()+'"';
		responsesLogEntry += ',"'+this.statusCode+'"';
		responsesLogEntry += ',"'+this.stopwatch.precision+'"';
		responsesLogEntry += ',"'+this.stopwatch.elapsedTime+'"';

		return responsesLogEntry;
	},

});