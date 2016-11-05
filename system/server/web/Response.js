// Dependencies
import Headers from './../../../system/web/headers/Headers.js';
import Cookies from './../../../system/web/headers/Cookies.js';
import RangeHeader from './../../../system/web/headers/RangeHeader.js';
import Stopwatch from './../../../system/time/Stopwatch.js';
import HtmlDocument from './../../../system/interface/graphical/web/html/HtmlDocument.js';
import Data from './../../../system/data/Data.js';
import File from './../../../system/file-system/File.js';
import ArchivedFile from './../../../system/archive/file-system-objects/ArchivedFile.js';
import NotFoundError from './../../../system/server/web/errors/NotFoundError.js';

// Class
class Response {

	id = null; // Unique identifier for the response

	request = null;

	stopwatches = {
		process: null,
		send: null,
	};
	buildStopwatch = null;
	
	// Encodings
	encoding = 'identity';
	acceptedEncodings = [];
	contentEncoded = false;

	// Headers
	statusCode = null;
	headers = new Headers();
	cookies = new Cookies();

	// Content
	content = '';

	// Keep track of whether or not the request has been handled (is sending or has been sent)
	handled = false;

	// The time the request is completely sent
	time = null;

	nodeResponse = null;
	webServer = null;

	constructor(nodeResponse, request, webServer) {
		// Hold onto Node's response object
		this.nodeResponse = nodeResponse;

		// Track processing time and sending time
		this.stopwatches.process = new Stopwatch();
		this.stopwatches.send = new Stopwatch();

		// Reference the associated request and and web server
		this.request = request;
		this.webServer = webServer;

		// The response ID matches the request ID
		this.id = this.request.id;
	}

	setAcceptedEncodings(acceptEncodeHeaderString) {
		if(acceptEncodeHeaderString && String.is(acceptEncodeHeaderString)) {
			var acceptedEncodings = acceptEncodeHeaderString.split(',');
			for(var i = 0; i < acceptedEncodings.length; i++) {
				this.acceptedEncodings.append(acceptedEncodings[i].trim());
			}

			// Encode if we do not have a contentType (means we are probably text/html) or if we match a content type on the white list
			var contentType = this.headers.get('Content-Type');
			if(!contentType || Response.contentTypesToEncode.contains(contentType)) {
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
	}

	async send(evenIfHandled) {
		// Don't send the request if it is already handled unless forced
		// evenIfHandled allows us to send an error response in the case of the code in this method failing
		if(this.handled && !evenIfHandled) {
			return;
		}

		// Mark the response as handled
		this.handled = true;

		// Handle range requests
		var requestRangeHeader = this.request.headers.get('Range');
		//app.log('requestRangeHeader', requestRangeHeader);
		if(requestRangeHeader) {
			this.request.range = new RangeHeader(requestRangeHeader);
			//app.log('this.request.range', this.request.range);
		}

		// If the content is something
		if(this.content) {
			//app.highlight(this.content);

			// Handle when the content is an ArchivedFile
			if(Class.isInstance(this.content, ArchivedFile)) {
				await this.handleContentIsArchivedFile();
			}
			// Handle when the content is a File
			else if(Class.isInstance(this.content, File)) {
				await this.handleContentIsFile();
			}
			// Handle when the content is an HtmlDocument
			else if(Class.isInstance(this.content, HtmlDocument)) {
				await this.handleContentIsHtmlDocument();
			}
			// If the content isn't a string, buffer, or stream, JSON encode it
			else if(!String.is(this.content) && !Buffer.is(this.content) && !Stream.is(this.content)) {
				await this.handleContentIsObject();
			}
		}

		// Handle If-Modified-Since request header
		var ifModifiedSince = this.request.headers.get('If-Modified-Since');
		if(ifModifiedSince) {
			var lastModified = this.headers.get('Last-Modified');
			if(lastModified) {
				//app.log(ifModifiedSince, lastModified);
				if(ifModifiedSince === lastModified) {
					this.statusCode = 304; // Not Modified
				}
			}
		}

		// Handle If-None-Match request header
		var ifNoneMatch = this.request.headers.get('If-None-Match');
		if(ifNoneMatch) {
			var eTag = this.headers.get('ETag');
			if(eTag) {
				//app.log(ifNoneMatch, eTag);
				if(ifNoneMatch === eTag) {
					this.statusCode = 304; // Not Modified
				}
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

		// Identify reasons to not send the content (just send the headers)
		var doNotSendContent = false;

		// If the request is a HEAD request
		if(this.request.method.lowercase() == 'head') {
			doNotSendContent = true;
		}
		// The status code is 304 (Not Modified)
		else if(this.statusCode == 304) {
			doNotSendContent = true;
		}

		// If we are not going to send content, add a Connection: close header
		if(doNotSendContent) {
			this.headers.set('Connection', 'close');
		}

		// If the Node response has already been sent
		if(this.nodeResponse.headersSent) {
			app.error('Headers already sent, need to understand why...');
			this.sent();
		}
		// If the Node response has not been sent
		else {
			// Send the headers
			this.sendHeaders();

			if(doNotSendContent) {
				//app.log('not sending content');
				this.nodeResponse.end(function() {
					this.sent();
				}.bind(this));
			}
			// Send the content
			else {
				this.sendContent();
			}
		}		
	}

	sendHeaders() {
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
			this.headers.set('Content-Encoding', this.encoding);
		}

		// Track the elapsed time
		this.stopwatches.process.stop();
		this.headers.set('X-Processing-Time-in-'+this.stopwatches.process.precision.capitalize(), this.stopwatches.process.getHighResolutionElapsedTime());

		// Send the response ID to the client
		this.headers.set('X-Response-ID', this.id);

		// Add the response cookies to the headers
		this.headers.addCookies(this.cookies);

		// Write the headers out
		this.nodeResponse.writeHead(this.statusCode, this.headers.toArray());

		//app.highlight(this.headers.toArray());
	}

	async handleContentIsArchivedFile() {
		// Set the Content-Type header
		//app.highlight(this.content.path);
		var contentType = File.getContentType(this.content.path);
		this.headers.set('Content-Type', contentType);

		// Set the Content-Disposition header, by specifying inline the browser will try to display the content and if it cannot it will download it
		this.headers.set('Content-Disposition', 'inline; filename="'+this.content.name+'"');

		// Set the Last-Modified header
		this.headers.set('Last-Modified', this.content.timeModified.dateObject.toUTCString());

		// Set the ETag header
		this.headers.set('ETag', Node.Cryptography.createHash('md5').update(this.name+'/'+this.content.timeModified.dateObject.toUTCString()+'/'+this.content.archivedSizeInBytes+'/'+this.content.extractedSizeInBytes).digest('hex'));

		// Byte serving is not supported
		this.headers.set('Accept-Ranges', 'none');

		// If the archived file is compressed with deflate and the requester has said they accept deflate, leave the archived file compressed and let the client deflate it
		this.content = await this.content.toReadStream();
	}

	async handleContentIsFile() {
		// Check if the file exists
		var fileExists = await this.content.exists();

		// If the file exists
		if(fileExists) {
			// Set the Content-Type header
			var contentType = File.getContentType(this.content.path);
			this.headers.set('Content-Type', contentType);

			// Set the Content-Disposition header, by specifying inline the browser will try to display the content and if it cannot it will download it
			this.headers.set('Content-Disposition', 'inline; filename="'+this.content.name+'"');

			// Set the Last-Modified header
			await this.content.initializeStatus();
			this.headers.set('Last-Modified', this.content.timeModified.dateObject.toUTCString());

			// Set the ETag header
			this.headers.set('ETag', Node.Cryptography.createHash('md5').update(this.name+'/'+this.content.timeModified.dateObject.toUTCString()+'/'+this.content.sizeInBytes()).digest('hex'));

			// Advertise byte serving
			this.headers.set('Accept-Ranges', 'bytes');

			// Support range requests (byte serving), currently do not support multiple ranges in a single request
			if(this.request.range && this.request.range.ranges.length == 1) {
				var readStreamRange = this.request.range.getReadStreamRange(this.content.sizeInBytes());
				//app.log('readStreamRange', readStreamRange);

				// Always set the status code to 206 when we set Content-Range, even if we are sending the entire resource
				this.statusCode = 206;

				// Do not set the Content-Length header since we are sending a stream with transfer-encoding: chunked
				//this.headers.set('Content-Length', this.request.range.getContentLength(this.content.sizeInBytes()));

				// Set the Content-Range header
				this.headers.set('Content-Range', this.request.range.getContentRange(this.content.sizeInBytes()));

				// Turn the file into a read stream
				this.content = await this.content.toReadStream(readStreamRange);
			}
			// Send the entire file
			else {
				// Turn the file into a read stream
				this.content = await this.content.toReadStream();
			}
		}
		// If the file does not exist, send a 404
		else {
			throw new NotFoundError(this.content.name+' not found.');
		}
	}

	async handleContentIsHtmlDocument() {
		this.headers.set('Content-Type', 'text/html');
		this.content = this.content.toString(false); // No indentation

		// Set the ETag header
		this.headers.set('ETag', Node.Cryptography.createHash('md5').update(this.request.url+'/'+this.content).digest('hex'));
	}

	async handleContentIsObject() {
		this.headers.set('Content-Type', 'application/json');
		this.content = Json.encode(this.content);

		// Set the ETag header
		this.headers.set('ETag', Node.Cryptography.createHash('md5').update(this.request.url+'/'+this.content).digest('hex'));
	}

	async sendContent() {
		//app.log(this.content);
		//app.log(this.acceptedEncodings);
		//app.log('contentEncoded', this.contentEncoded);

		// Handle streams
		if(Stream.is(this.content)) {
			// If the content is not encoded and the encoding is deflate
			if(!this.contentEncoded && this.encoding == 'deflate') {
				var deflate = Node.Zlib.createDeflate();
				this.content.pipe(deflate).pipe(this.nodeResponse).on('finish', function() {
					//app.log('done sending!')
					this.sent();
				}.bind(this));
			}
			// If the content is not encoded and the encoding is gzip
			else if(!this.contentEncoded && this.encoding == 'gzip') {
				var gzip = Node.Zlib.createGzip();
				this.content.pipe(gzip).pipe(this.nodeResponse).on('finish', function() {
					//app.log('done sending!')
					this.sent();
				}.bind(this));
			}
			// If there is no encoding
			else {
				this.content.pipe(this.nodeResponse).on('finish', function() {
					//app.log('done sending!')
					this.sent();
				}.bind(this));
			}
		}
		else {
			// If the content is not encoded and we need to encode
			if(!this.contentEncoded && (this.encoding == 'gzip' || this.encoding == 'deflate')) {
				this.content = await Data.encode(this.content, this.encoding);
			}

			// End the response
			this.nodeResponse.end(this.content, function() {
				//app.highlight('Ending response');
				this.sent();
			}.bind(this));
		}
	}

	sent() {
		// Record the time
		this.time = new Time();

		// Stop the send stopwatch
		this.stopwatches.send.stop();

		// Show the request in the console
		var responsesLogEntry = this.prepareLogEntry();
		if(this.webServer.settings.get('verbose')) {
			app.log(this.webServer.identifier+' response: '+responsesLogEntry);
		}

		// Conditionally log the request
		if(this.webServer.logs.responses) {
			this.webServer.logs.responses.write(responsesLogEntry+"\n")
		}
	}

	prepareLogEntry() {
		var responsesLogEntry = '';

		responsesLogEntry += '"'+this.id+'"';
		responsesLogEntry += ',"'+this.time.dateTime+'"';
		responsesLogEntry += ',"'+this.statusCode+'"';
		responsesLogEntry += ',"'+this.stopwatches.process.precision+'"';
		responsesLogEntry += ',"'+this.stopwatches.process.getHighResolutionElapsedTime()+'"';
		responsesLogEntry += ',"'+this.stopwatches.send.getHighResolutionElapsedTime()+'"';

		return responsesLogEntry;
	}

	static contentTypesToEncode = [
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
	    //'audio/mpeg', // Testing range requests with content-encoding
	];

}

// Export
export default Response;
