var http = require('http');
var Promise = require('./framework/libraries/bluebird');

var PromiseRequest = Promise.method(function(options) {
    return new Promise(function(resolve, reject) { 
		var request = http.request(options, function(response) {
			// Bundle the result
			var result = {
				'httpVersion': new Version(response.httpVersion),
				'httpStatusCode': response.statusCode,
				'headers': response.headers,
				'body': '',
				'trailers': response.trailers,
			};

			// Build the body
			response.on('data', function(chunk) {
				result.body += chunk;
			});

			// Resolve the promise
			resolve(result);
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

var myRequest = PromiseRequest({
	method: 'GET',
	host: 'www.nodejs.org',
	port: 80,
	path: '/',
}).then(function(value) {
	console.log('value:', value);
});