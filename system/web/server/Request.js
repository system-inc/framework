// Dependencies
import { Headers } from '@framework/system/server/protocols/http/messages/headers/Headers.js';
import { Cookies } from '@framework/system/server/protocols/http/messages/headers/Cookies.js';
import { Url } from '@framework/system/web/Url.js';
import { IpAddress } from '@framework/system/network/IpAddress.js';
import { Browser } from '@framework/system/web/Browser.js';
import { Device } from '@framework/system/hardware/Device.js';
import { OperatingSystem } from '@framework/system/operating-system/OperatingSystem.js';
import { Geolocation } from '@framework/system/geolocation/Geolocation.js';
import { Country } from '@framework/system/geolocation/Country.js';
import { Version } from '@framework/system/version/Version.js';
import { RequestEntityTooLargeError } from '@framework/system/web/server/errors/RequestEntityTooLargeError.js';

// Class
class Request {

	id = null; // Unique identifier for the request

	method = null;
	url = null;
	headers = null;
	cookies = null;
	body = '';
	data = null;

	range = null; // The parsed Range header, this property is set in Response.js to gracefully handle parsing exceptions

	ipAddress = null;
	connectingIpAddress = null;

	referrer = null;
	browser = null;
	device = null;
	operatingSystem = null;
	geolocation = null;

	httpVersion = null;
	time = null;

	nodeRequest = null;
	webServer = null;
	
	constructor(nodeRequest, webServer) {
		// Hold onto Node's request object
		this.nodeRequest = nodeRequest;

		// Reference the associated web server
		if(webServer) {
			this.webServer = webServer;
		}

		// ID
		this.id = String.uniqueIdentifier();

		// Time
		this.time = new Time();

		// URL
		this.url = Url.fromNodeRequest(nodeRequest);

		// Method
		this.method = nodeRequest.method.uppercase();

		// Headers
		this.headers = Headers.fromNodeHeaders(nodeRequest.headers);

		// Cookies
		this.cookies = new Cookies(this.headers.get('cookie'));

		// Content
		//this.content = {
		//	'length': this.headers.get('content-length'),
		//	'type': this.headers.get('type'),
		//};
		
		// Referrer
		this.referrer = new Url(this.headers.get('referer'));

		// Cache the user agent
		var userAgent = this.headers.get('user-agent');

		// Revisit IP address to see if X-Forwarded-For is set
		var xForwardedFor = this.headers.get('x-forwarded-for');
		if(xForwardedFor) {
			// Catch x.x.x.x,y.y.y.y format
			if(xForwardedFor.contains(',')) {
				this.ipAddress = IpAddress.create(xForwardedFor.split(',').first());
			}
			else {
				this.ipAddress = IpAddress.create(xForwardedFor);	
			}
		}

		// Browser identification from user agent
		this.browser = Browser.fromUserAgent(userAgent);

		// Device identification from user agent
		this.device = Device.fromUserAgent(userAgent);

		// Operating system identification from user agent
		this.operatingSystem = OperatingSystem.fromUserAgent(userAgent);

		// Geolocation (optionally provided by Cloudflare)
		this.geolocation = new Geolocation();
		this.geolocation.country = new Country();
		this.geolocation.country.code = this.headers.get('cf-ipcountry');

		// HTTP version
		this.httpVersion = new Version({
			'major': nodeRequest.httpVersionMajor,
			'minor': nodeRequest.httpVersionMinor,
		});
	}

	async initialize() {
		// IP address
		//app.log(Json.encode(nodeRequest.connection.remoteAddress));
		this.ipAddress = this.connectingIpAddress = await IpAddress.create(this.nodeRequest.connection.remoteAddress);
	}

	isSecure() {
		return this.url.protocol == 'https';
	}

	processBody() {
		if(Json.is(this.body)) {
			this.data = Json.decode(this.body);
		}
	}

	received() {
		// Show the request in the console
		var requestsLogEntry = this.prepareLogEntry();
		if(this.webServer.settings.get('verbose')) {
			app.log(this.webServer.identifier+' request: '+requestsLogEntry);
		}

		// Conditionally log the request
		if(this.webServer.logs.requests) {
			this.webServer.logs.requests.write(requestsLogEntry+"\n")
		}
	}

	prepareLogEntry() {
		var requestsLogEntry = '';
		requestsLogEntry += '"'+this.id+'"';
		requestsLogEntry += ',"'+this.time.dateTime+'"';
		requestsLogEntry += ',"'+this.ipAddress.address+'"';
		requestsLogEntry += ',"'+this.method+'"';
		requestsLogEntry += ',"'+this.url.url+'"';
		requestsLogEntry += ',"'+this.referrer.url+'"';

		return requestsLogEntry;
	}

	getPublicErrorData() {
		return {
			'id': this.id,
			'method': this.method,
			'url': this.url.input,
			'headers': this.headers.headers,
			'cookies': this.cookies.cookies,
			'ipAddress': this.ipAddress.address,
			'connectingIpAddress': this.connectingIpAddress.address,
			'time': this.time.time,
		};
	}

	static async receiveNodeRequest(request, maximumRequestBodySizeInBytes) {
		var nodeRequest = await new Promise(function(resolve, reject) {
	    	// Build the request body
			request.nodeRequest.on('data', function(chunk) {
				// Append the chunk to the body
				request.body += chunk;

	            // If there is too much data in the body, kill the connection
	            if(request.body.sizeInBytes() > maximumRequestBodySizeInBytes) {
	            	throw new RequestEntityTooLargeError('The request failed because it was larger than '+maximumRequestBodySizeInBytes+' bytes.');
	            }
			});

			// When the nodeRequest finishes, resolve the promise
			request.nodeRequest.on('end', function() {
				// Process the completed body
				request.processBody();

				// Resolve the nodeRequest
				resolve(request.nodeRequest);
			});
	    });

	    return nodeRequest;
	}
	
}

// Export
export { Request };
