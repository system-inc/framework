Web = function() {
}

Web.request = Promise.method(function(options) {
    return new Promise(function(resolve, reject) {
    	// Time the request
    	var stopwatch = new Stopwatch({
    		precision: 'milliseconds',
    	});

		var request = Node.Http.request(options, function(response) {
			// Set the encoding
			if(options && options.encoding) {
				response.setEncoding(options.encoding);
			}

			var chunks = [];

			// Bundle the result
			var result = {
				'statusCode': response.statusCode,
				'headers': Headers.constructFromNodeHeaders(response.headers),
				'body': '',
				'data': null,
				'trailers': response.trailers,
				'httpVersion': new Version({
					'major': response.httpVersionMajor,
					'minor': response.httpVersionMinor,
				}),
				'stopwatch': stopwatch,
			};
			//console.log('result (before finish)', result);

			var finish = function*() {
				// Get the content encoding
				var contentEncoding = result.headers.get('content-encoding');

				// Concatenate all of the data chunks into one buffer
				var buffer = Buffer.concat(chunks);

				// Gzip
				if(contentEncoding == 'gzip') {
					result.body = yield Data.decode(buffer, contentEncoding);
				}
				// No content encoding
				else {
					result.body = buffer.toString();
				}

				// Automatically decode the response body if it is JSON
				if(Json.is(result.body)) {
					result.data = Json.decode(result.body);
				}

				// Set the trailers
				result.trailers = response.trailers;

				// Stop and attach the stopwatch
				result.stopwatch = stopwatch.stop();

				//console.log('Web request finished:', result);

				// Resolve the promise
				resolve(result);
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
});