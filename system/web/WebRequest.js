// Dependencies
import Headers from 'framework/system/web/headers/Headers.js';
import Cookies from 'framework/system/web/headers/Cookies.js';
import Url from 'framework/system/web/Url.js';
import Version from 'framework/system/version/Version.js';
import Stopwatch from 'framework/system/time/Stopwatch.js';
import IpAddress from 'framework/system/network/IpAddress.js';
import Data from 'framework/system/data/Data.js';

// Class
class WebRequest {

	method = 'GET';
	url = null;
	data = null;
	body = null;
	headers = new Headers();
	cookies = new Cookies();
	encoding = null; // Must use null encoding in order for gzipped responses to work, can be null, binary, utf8, ascii, hex, base64
	decode = true;
	authorizeConnection = false;
	requestCertificate = false;
	timeoutInMilliseconds = 20 * 1000;

	constructor(url, options) {
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
			if(options.timeoutInMilliseconds !== undefined) {
				this.timeoutInMilliseconds = options.timeoutInMilliseconds;
			}
		}

		//app.log(this.url);
		
		// If set, make sure body is a string
		if(this.body && !String.is(this.body)) {
			this.body = Json.encode(this.body);
		}

		// If data is set, method is GET, and no body, convert data to query parameters
		if(this.data && this.method == 'GET' && !this.body) {
			this.data.each(function(key, value) {
				//app.log('setting query param', key, value, this.url);
				this.url.setQueryParameter(key, value);
				//app.log('query param set', key, value, this.url);
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
		if(!this.headers.getHeader('Accept-Encoding')) {
			this.headers.create('Accept-Encoding', 'gzip');
		}

		// Do not send any headers that are null
		this.headers.removeNullHeaders();

		// Add cookies to the headers
		this.headers.addCookies(this.cookies);
	}

	async execute(url, options) {
		var webRequest = this;

		// Allow execute to be called statically
		if(url !== undefined) {
			webRequest = new WebRequest(url, options);
		}

		var path = webRequest.url.path;
		if(webRequest.url.queryString) {
			path += webRequest.url.queryString;
		}

		var options = {
			url: webRequest.url,
			method: webRequest.method,
			protocol: webRequest.url.protocol,
			host: webRequest.url.host,
			port: webRequest.url.port,
			path: path,
			encoding: webRequest.encoding,
			decode: webRequest.decode,
			body: webRequest.body,
			headers: webRequest.headers.toObject(),
			rejectUnauthorized: webRequest.authorizeConnection,
			requestCert: webRequest.requestCertificate,
			timeout: webRequest.timeoutInMilliseconds,
		};

		var response = await WebRequest.request(options);
		//app.log(response);

		return response;
	}

	static execute = WebRequest.prototype.execute;

	static async request(options) {
		var promiseResult = await new Promise(function(resolve, reject) {
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

				//app.info('response', response);

				var url = null;
				if(options.url) {
					url = options.url;
				}
				else {
					url = new Url(options.protocol+'//'+options.host+':'+options.port+options.path);
				}

				// Bundle the webResponse
				var webResponse = {
					url: url,
					statusCode: response.statusCode,
					statusMessage: response.statusMessage,
					headers: Headers.constructFromNodeHeaders(response.headers),
					rawHeaders: response.rawHeaders,
					cookies: null, // This is set further down
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
				//app.log('webResponse (before finish)', webResponse);

				// Header debugging
				//app.warn(webResponse.headers);
				//app.exit(response.rawHeaders);
				//app.exit(response.headers);

				// Set the cookies from the headers
				webResponse.cookies = webResponse.headers.getCookies();

				var finish = async function() {
					// Get the content encoding
					var contentEncoding = webResponse.headers.get('content-encoding');
					//app.highlight(webResponse.headers);
					//app.highlight('contentEncoding', contentEncoding);

					// Concatenate all of the data chunks into one buffer
					var buffer = Buffer.concat(chunks);
					//app.highlight('decode', options.decode, 'buffer', buffer, 'buffer.toString()', buffer.toString());

					// If we are to decode the response
					if(options.decode) {
						// Gzip or defalte
						if(contentEncoding == 'gzip' || contentEncoding == 'deflate') {
							webResponse.body = await Data.decode(buffer, contentEncoding);
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

					//app.log('Web request finished:', webResponse);

					// Resolve the promise
					resolve(webResponse);
				}

				// Build the body
				response.on('data', function(chunk) {
					//app.log('Got chunk...', chunk.substring(0, 30));
					chunks.append(chunk);
				});

				// Resolve the promise when the response ends
				response.on('end', function() {
					//app.log('end event');
					finish();
				});

				// Resolve the promise when the response ends
				response.on('close', function() {
					//app.log('close event');
					finish();
				});
			});

			//app.log('WebRequest.request', request);

			// Handle errors
			request.on('error', function(error) {
				app.log('Problem with request:', error.message);
				reject(error);
			});

			// Write the body if it exists
			if(options.body) {
				request.write(options.body);
			}

			//app.log('WebRequest.request', 'ending request...');

			// Must always call .end() even if there is no data being written to the request body
			request.end();
	    });

		return promiseResult;
	}
	
}

// Export
export default WebRequest;
