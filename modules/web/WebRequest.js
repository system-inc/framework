// Dependencies
var Headers = Framework.require('modules/web/headers/Headers.js');
var Cookies = Framework.require('modules/web/headers/Cookies.js');
var Url = Framework.require('modules/web/Url.js');
var Stopwatch = Framework.require('modules/time/Stopwatch.js');
var IpAddress = Framework.require('modules/network/IpAddress.js');
var Data = Framework.require('modules/data/Data.js');

// Class
var WebRequest = Class.extend({

	method: 'GET',
	url: null,
	data: null,
	body: null,
	headers: new Headers(),
	cookies: new Cookies(),
	encoding: null, // Must use null encoding in order for gzipped responses to work, can be null, binary, utf8, ascii, hex, base64
	decode: true,
	authorizeConnection: false,
	requestCertificate: false,

	construct: function(url, options) {
		// Make sure we are working with a URL object
		if(String.is(url)) {
			this.url = new Url(url);	
		}
		else {
			this.url = url;
		}

		if(options) {
			if(options.method !== undefined) {
				this.method = options.method.uppercase();
			}
			if(options.encoding !== undefined) {
				this.encoding = options.encoding;
			}
			if(options.decode !== undefined) {
				this.decode = options.decode;
			}
			if(options.data !== undefined) {
				this.data = options.data;
			}
			if(options.body !== undefined) {
				this.body = options.body;
			}
			if(options.headers !== undefined) {
				// If we have a Headers object, turn it into an object
				if(Class.isInstance(options.headers, Headers)) {
					options.headers = options.headers.toObject();
				}

				options.headers.each(function(key, value) {
					this.headers.create(key, value);
				}.bind(this));
			}
			if(options.cookies !== undefined) {
				options.cookies.each(function(key, value) {
					this.cookies.create(key, value);
				}.bind(this));
			}
			if(options.authorizeConnection !== undefined) {
				this.authorizeConnection = options.authorizeConnection;
			}
			if(options.requestCertificate !== undefined) {
				this.requestCertificate = options.requestCertificate;
			}
		}

		//Console.log(this.url);
		
		// If set, make sure body is a string
		if(this.body && !String.is(this.body)) {
			this.body = Json.encode(this.body);
		}

		// If data is set, method is GET, and no body, convert data to query parameters
		if(this.data && this.method == 'GET' && !this.body) {
			this.data.each(function(key, value) {
				//Console.log('setting query param', key, value, this.url);
				this.url.setQueryParameter(key, value);
				//Console.log('query param set', key, value, this.url);
			}.bind(this));
		}
		// If data is set, method is anything but GET, and no body, convert data to body
		else if(this.data && !this.body) {
			// Convert non-primitives to JSON
			if(!Primitive.is(this.data)) {
				this.body = Json.encode(this.data);
			}
			else {
				this.body = this.data;
			}
		}

		// Make sure Content-Length header is set, may run into issues if it is not
		if(!this.headers.get('Content-Length')) {
			this.headers.create('Content-Length', this.body ? this.body.sizeInBytes() : 0);	
		}
		
		// Accept gzip encoding by default
		if(!this.headers.get('Accept-Encoding')) {
			this.headers.create('Accept-Encoding', 'gzip');
		}

		// Add cookies to the headers
		this.headers.addCookies(this.cookies);
	},

	execute: function*(url, options) {
		var webRequest = this;

		// Allow execute to be called statically
		if(url !== undefined) {
			webRequest = new WebRequest(url, options);
		}

		var options = {
			method: webRequest.method,
			protocol: webRequest.url.protocol,
			host: webRequest.url.host,
			port: webRequest.url.port,
			path: webRequest.url.path+webRequest.url.queryString,
			encoding: webRequest.encoding,
			decode: webRequest.decode,
			body: webRequest.body,
			headers: webRequest.headers.toObject(),
			rejectUnauthorized: webRequest.authorizeConnection,
			requestCert: webRequest.requestCertificate,
		};

		var response = yield WebRequest.request(options);
		//Console.log(response);

		return response;
	},
	
});

// Static methods
WebRequest.execute = WebRequest.prototype.execute;

WebRequest.request = function(options) {
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

			//Console.log('response!!!', response);

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
				bytesReceived: response.connection.bytesRead,
				bytesSent: response.connection.bytesWritten,
				ipAddress: new IpAddress(response.connection.remoteAddress),
			};
			//Console.log('webResponse (before finish)', webResponse);

			// Set the cookies from the headers
			webResponse.cookies = webResponse.headers.getCookies();

			var finish = function*() {
				// Get the content encoding
				var contentEncoding = webResponse.headers.get('content-encoding');
				//Console.highlight(webResponse.headers);
				//Console.highlight('contentEncoding', contentEncoding);

				// Concatenate all of the data chunks into one buffer
				var buffer = Buffer.concat(chunks);
				//Console.highlight('decode', options.decode, 'buffer', buffer.toString());

				// If we are to decode the response
				if(options.decode) {
					// Gzip or defalte
					if(contentEncoding == 'gzip' || contentEncoding == 'deflate') {
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
				}
				// If we are not supposed to decode the response
				else {
					webResponse.body = buffer;
				}

				// Set the trailers
				webResponse.trailers = response.trailers;

				// Stop and attach the stopwatch
				webResponse.stopwatch = stopwatch.stop();

				//Console.log('Web request finished:', webResponse);

				// Resolve the promise
				resolve(webResponse);
			}

			// Build the body
			response.on('data', function(chunk) {
				//Console.log('Got chunk...', chunk.substring(0, 30));
				chunks.push(chunk);
			});

			// Resolve the promise when the response ends
			response.on('end', function() {
				//Console.log('end event');
				Generator.run(finish);
			});

			// Resolve the promise when the response ends
			response.on('close', function() {
				//Console.log('close event');
				Generator.run(finish);
			});
		});

		//Console.log('WebRequest.request', request);

		// Handle errors
		request.on('error', function(error) {
			Console.log('Problem with request:', error.message);
			reject(error);
		});

		// Write the body if it exists
		if(options.body) {
			request.write(options.body);
		}

		//Console.log('WebRequest.request', 'ending request...');

		// Must always call .end() even if there is no data being written to the request body
		request.end();
    });
}

// Export
module.exports = WebRequest;