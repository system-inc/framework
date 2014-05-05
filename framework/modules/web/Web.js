require('./Browser');
require('./Url');
require('./WebRequest');

Web = function() {
}

Web.request = Promise.method(function(options) {
    return new Promise(function(resolve, reject) {
    	// Time the request
    	var stopwatch = new Stopwatch({
    		precision: 'milliseconds',
    	});

		var request = NodeHttp.request(options, function(response) {
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

			// Build the body
			response.on('data', function(chunk) {
				result.body += chunk;
			});

			// Resolve the promise when the response ends
			response.on('end', function() {
				if(Json.is(result.body)) {
					result.body = Json.decode(result.body);
				}

				resolve(result);
			});
		});

		// Handle errors
		request.on('error', function(error) {
			console.log('Problem with request:', error.message);
			reject(error);
		});

		// Must always call .end() even if there is no data being written to the request body
		request.end();
    });
});