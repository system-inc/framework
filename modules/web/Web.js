Web = function() {
}

Web.request = function(options) {
    return new Promise(function(resolve, reject) {
    	// Time the request
    	var stopwatch = new Stopwatch({
    		precision: 'milliseconds',
    	});

    	// Use either Node.Http or Node.Https
    	var nodeHttpLibraryName = options.protocol.capitalize();

    	// Reform protocol, it expects it to end with a colon
    	if(!options.protocol.endsWith(':')) {
    		options.protocol = options.protocol + ':';
    	}

		var request = Node[nodeHttpLibraryName].request(options, function(response) {
			// Set the encoding
			if(options && options.encoding) {
				response.setEncoding(options.encoding);
			}

			var chunks = [];

			console.log('response!!!', response);

			// Bundle the webResponse
			var webResponse = {
				url: new Url(options.protocol+'//'+options.host+':'+options.port+options.path),
				statusCode: response.statusCode,
				statusMessage: response.statusMessage,
				headers: Headers.constructFromNodeHeaders(response.headers),
				rawHeaders: response.rawHeaders,
				cookies: null,
				body: '',
				data: null,
				trailers: response.trailers,
				rawTrailers: response.rawTrailers,
				httpVersion: new Version({
					major: response.httpVersionMajor,
					minor: response.httpVersionMinor,
				}),
				stopwatch: stopwatch,
				request: {
					rawHeaders: request._header,
				},
			};
			//console.log('webResponse (before finish)', webResponse);

			// Set the cookies from the headers
			webResponse.cookies = webResponse.headers.getCookies();

			var finish = function*() {
				// Get the content encoding
				var contentEncoding = webResponse.headers.get('content-encoding');

				// Concatenate all of the data chunks into one buffer
				var buffer = Buffer.concat(chunks);

				// Gzip
				if(contentEncoding == 'gzip') {
					webResponse.body = yield Data.decode(buffer, contentEncoding);
				}
				// No content encoding
				else {
					webResponse.body = buffer.toString();
				}

				// Automatically decode the response body if it is JSON
				if(Json.is(webResponse.body)) {
					webResponse.data = Json.decode(webResponse.body);
				}

				// Set the trailers
				webResponse.trailers = response.trailers;

				// Stop and attach the stopwatch
				webResponse.stopwatch = stopwatch.stop();

				//console.log('Web request finished:', webResponse);

				// Resolve the promise
				resolve(webResponse);
			}

			// Build the body
			response.on('data', function(chunk) {
				//console.log('Got chunk...', chunk.substring(0, 30));
				chunks.push(chunk);
			});

			// Resolve the promise when the response ends
			response.on('end', function() {
				//console.log('end event');
				Generator.run(finish);
			});

			// Resolve the promise when the response ends
			response.on('close', function() {
				//console.log('close event');
				Generator.run(finish);
			});
		});

		//console.log('Web.request', request);

		// Handle errors
		request.on('error', function(error) {
			Console.out('Problem with request:', error.message);
			reject(error);
		});

		// Write the body if it exists
		if(options.body) {
			request.write(options.body);
		}

		//console.log('Web.request', 'ending request...');

		// Must always call .end() even if there is no data being written to the request body
		request.end();
    });
}