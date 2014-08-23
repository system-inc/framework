Web = function() {
}

Web.request = Promise.method(function(options) {
    return new Promise(function(resolve, reject) {
    	// Time the request
    	var stopwatch = new Stopwatch({
    		precision: 'milliseconds',
    	});

		var request = NodeHttp.request(options, function(response) {
			// Set the encoding
			if(options && options.encoding) {
				response.setEncoding(options.encoding);
			}			

			// Bundle the result
			var result = {
				'statusCode': response.statusCode,
				'headers': Headers.constructFromNodeHeaders(response.headers),
				'body': '',
				'trailers': response.trailers,
				'httpVersion': new Version({
					'major': response.httpVersionMajor,
					'minor': response.httpVersionMinor,
				}),
				'stopwatch': stopwatch.end(),
			};

			var finish = function() {
				// Automatically decode the response body if it is JSON
				if(Json.is(result.body)) {
					result.body = Json.decode(result.body);
				}

				// Set the trailers
				result.trailers = response.trailers;

				// Resolve the promise
				resolve(result);
			}

			// Build the body
			response.on('data', function(chunk) {
				result.body += chunk;
			});

			// Resolve the promise when the response ends
			response.on('end', function() {
				finish();
			});

			// Resolve the promise when the response ends
			response.on('close', function() {
				finish();
			});
		});

		// Handle errors
		request.on('error', function(error) {
			Console.out('Problem with request:', error.message);
			reject(error);
		});

		// Must always call .end() even if there is no data being written to the request body
		request.end();
    });
});