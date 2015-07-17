Response = Class.extend({

	id: null, // Unique identifier for the response
	request: null,
	webServer: null,
	stopwatches: {
		process: null,
		send: null,
	},
	buildStopwatch: null,
	nodeResponse: null,

	// Encodings
	encoding: 'identity',
	acceptedEncodings: [],
	contentEncoded: false,

	contentTypesToEncode: [
	    'text/html',
	    'application/x-javascript',
	    'text/css',
	    'application/javascript',
	    'text/javascript',
	    'text/plain',
	    'text/xml',
	    'application/json',
	    'application/vnd.ms-fontobject',
	    'application/x-font-opentype',
	    'application/x-font-truetype',
	    'application/x-font-ttf',
	    'application/xml',
	    'font/eot',
	    'font/opentype',
	    'font/otf',
	    'image/svg+xml',
	    'image/vnd.microsoft.icon',
	],

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

		// Track processing time and sending time
		this.stopwatches.process = new Stopwatch();
		this.stopwatches.send = new Stopwatch();
		
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

			// Encode if we do not have a contentType (means we are probably text/html) or if we match a content type on the white list
			var contentType = this.headers.get('Content-Type');
			if(!contentType || this.contentTypesToEncode.contains(contentType)) {
				// Deflate is faster than gzip
				if(this.acceptedEncodings.contains('deflate', false)) {
					this.encoding = 'deflate';
				}
				else if(this.acceptedEncodings.contains('gzip', false)) {
					this.encoding = 'gzip';
				}
			}
			// Do not encode unless the conditions above are met
			else {
				this.encoding =  null;
			}
		}

		return this.acceptedEncodings;
	},

	send: function*(evenIfHandled) {
		// Don't send the request if it is already handled unless forced
		if(this.handled && !evenIfHandled) {
			return;
		}

		// Mark the response as handled
		this.handled = true;

		// If the content is something
		var contentType;
		if(this.content) {
			// If the zip module is enabled and the content is a zipped file inside of a zip file
			if(global['ZippedFile'] && Class.isInstance(this.content, ZippedFile)) {
				// Set the Content-Type header
				contentType = File.getContentType(this.content.path);

				// If the zipped file is compressed with deflate and the requester has said they accept deflate, leave the zipped file compressed and make them deflate it
				if(this.content.compressionMethod == 'deflate' && this.request.headers.get('Accept-Encoding').contains('deflate')) {
					this.headers.set('Content-Encoding', 'deflate');
					this.content = yield this.content.toReadStream(false); // do not decompress
				}
				// Decompress the file
				else {
					this.content = yield this.content.toReadStream(); // decompress
				}				
			}
			// If the content is a file
			else if(Class.isInstance(this.content, File)) {
				// Check if the file exists
				var fileExists = yield this.content.exists();

				// If the file exists
				if(fileExists) {
					// Set the Content-Type header
					contentType = File.getContentType(this.content.path);
					this.headers.set('Content-Type', contentType);

					// Turn the file into a read stream
					//this.content = yield File.read(this.content.path);
					this.content = yield this.content.toReadStream();
				}
				// If the file does not exist, send a 404
				else {
					throw new NotFoundError(this.content.name+' not found.');
				}
			}
			// If the content is an HtmlDocument
			else if(Class.isInstance(this.content, HtmlDocument)) {
				this.headers.set('Content-Type', 'text/html');
				this.content = this.content.toString(false); // No indentation
			}
			// If the content isn't a string, buffer, or stream, JSON encode it
			else if(!String.is(this.content) && !Buffer.is(this.content) && !(this.content instanceof Node.Stream.Stream)) {
				this.headers.set('Content-Type', 'application/json');
				this.content = Json.encode(this.content);
			}
		}

		// If the Content-Encoding header is already set, use it (this is used for proxying requests)
		var contentEncodingHeaderValue = this.headers.get('Content-Encoding');
		if(contentEncodingHeaderValue) {
			this.encoding = contentEncodingHeaderValue;

			// Mark the content as already encoded (if we already have set a content encoding than the content must be encoded already)
			this.contentEncoded = true;
		}

		// If the content is not already encoded set the best encoding method based on what the user said they will accept
		if(!this.contentEncoded) {
			// Let the response know what accepted encodings the request allows
			this.setAcceptedEncodings(this.request.headers.get('Accept-Encoding'));
		}

		// Send the headers
		this.sendHeaders();

		// Send the content (yield until we finish)
		var contentSent = yield this.sendContent();

		// Wrap things up
		this.sent();
	},

	sendHeaders: function() {
		// Default statusCode is 200
		if(!this.statusCode) {
			this.statusCode = 200;
		}

		// If there is no encoding type specified, remove the Content-Encoding header
		if(!this.encoding) {
			this.headers.delete('Content-Encoding');
		}
		// If there is an encoding type specified, update the header
		else {
			this.headers.update('Content-Encoding', this.encoding);	
		}
		
		// Track the elapsed time
		this.stopwatches.process.stop();
		this.headers.create('X-Processing-Time-in-'+this.stopwatches.process.precision.capitalize(), this.stopwatches.process.elapsedTime);

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

		// If the content is a string and is not a stream, turn it into a stream
		if(String.is(this.content)) {
			this.content = this.content.toStream();
		}

		// Handle streams
		if(this.content instanceof Node.Stream.Stream) {
			// Return a promise that resolves when the response is completely sent
			return new Promise(function(resolve, reject) {
				// If the content is not encoded and the encoding is deflate
				if(!this.contentEncoded && this.encoding == 'deflate') {
					var deflate = Node.Zlib.createDeflate();
					this.content.pipe(deflate).pipe(this.nodeResponse).on('finish', function() {
						//console.log('done sending!')
						resolve(true);
					});
				}
				// If the content is not encoded and the encoding is gzip
				else if(!this.contentEncoded && this.encoding == 'gzip') {
					var gzip = Node.Zlib.createGzip();
					this.content.pipe(gzip).pipe(this.nodeResponse).on('finish', function() {
						//console.log('done sending!')
						resolve(true);
					});
				}
				// If there is no encoding
				else {
					this.content.pipe(this.nodeResponse).on('finish', function() {
						//console.log('done sending!')
						resolve(true);
					});
				}
			}.bind(this));
		}
		else {
			// If the content is not encoded and we need to encode
			if(!this.contentEncoded && (this.encoding == 'gzip' || this.encoding == 'deflate')) {
				this.content = yield Data.encode(this.content, this.encoding);
			}

			// End the response
			this.nodeResponse.end(this.content);
		}
	},

	sent: function() {
		// Record the time
		this.time = new Time();

		// Stop the send stopwatch
		this.stopwatches.send.stop();

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
		responsesLogEntry += ',"'+this.stopwatches.process.precision+'"';
		responsesLogEntry += ',"'+this.stopwatches.process.elapsedTime+'"';
		responsesLogEntry += ',"'+this.stopwatches.send.elapsedTime+'"';

		return responsesLogEntry;
	},

});