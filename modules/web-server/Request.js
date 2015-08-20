Request = Class.extend({

	id: null, // Unique identifier for the request

	method: null,
	url: null,
	headers: null,
	cookies: null,
	body: '',
	data: null,

	range: null,

	ipAddress: null,
	connectingIpAddress: null,

	referrer: null,
	browser: null,
	device: null,
	operatingSystem: null,
	geolocation: null,

	httpVersion: null,
	time: null,

	nodeRequest: null,
	webServer: null,
	
	construct: function(nodeRequest, webServer) {
		// Hold onto Node's request object
		this.nodeRequest = nodeRequest;

		// Reference the associated web server
		if(webServer != undefined) {
			this.webServer = webServer;
		}

		// ID
		this.id = String.uniqueIdentifier();

		// Time
		this.time = new Time();

		// URL
		this.url = Url.constructFromNodeRequest(nodeRequest);

		// Method
		this.method = nodeRequest.method.uppercase();

		// Headers
		this.headers = Headers.constructFromNodeHeaders(nodeRequest.headers);

		// Cookies
		this.cookies = new Cookies(this.headers.get('cookie'));

		// Content
		//this.content = {
		//	'length': this.headers.get('content-length'),
		//	'type': this.headers.get('type'),
		//};

		// IP address
		//Console.out(Json.encode(nodeRequest.connection.remoteAddress));
		this.ipAddress = this.connectingIpAddress = new IpAddress(nodeRequest.connection.remoteAddress);
		
		// Referrer
		this.referrer = new Url(this.headers.get('referer'));

		// Cache the user agent
		var userAgent = this.headers.get('user-agent');

		// Revisit IP address to see if X-Forwarded-For is set
		var xForwardedFor = this.headers.get('x-forwarded-for');
		if(xForwardedFor) {
			// Catch x.x.x.x,y.y.y.y format
			if(xForwardedFor.contains(',')) {
				this.ipAddress = new IpAddress(xForwardedFor.split(',').first());
			}
			else {
				this.ipAddress = new IpAddress(xForwardedFor);	
			}
		}

		// Browser identification from user agent
		this.browser = Browser.constructFromUserAgent(userAgent);

		// Device identification from user agent
		this.device = Device.constructFromUserAgent(userAgent);

		// Operating system identification from user agent
		this.operatingSystem = OperatingSystem.constructFromUserAgent(userAgent);

		// Geolocation (optionally provided by Cloudflare)
		this.geolocation = new Geolocation();
		this.geolocation.country = new Country();
		this.geolocation.country.code = this.headers.get('cf-ipcountry');

		// HTTP version
		this.httpVersion = new Version({
			'major': nodeRequest.httpVersionMajor,
			'minor': nodeRequest.httpVersionMinor,
		});
	},

	isSecure: function() {
		return this.url.protocol == 'https';
	},

	processBody: function() {
		if(Json.is(this.body)) {
			this.data = Json.decode(this.body);
		}
	},

	received: function() {
		// Show the request in the console
		var requestsLogEntry = this.prepareLogEntry();
		Console.out(this.webServer.identifier+' request: '+requestsLogEntry);

		// Conditionally log the request
		if(this.webServer.logs.requests) {
			this.webServer.logs.requests.write(requestsLogEntry+"\n")
		}
	},

	prepareLogEntry: function() {
		var requestsLogEntry = '';
		requestsLogEntry += '"'+this.id+'"';
		requestsLogEntry += ',"'+this.time.getDateTime()+'"';
		requestsLogEntry += ',"'+this.ipAddress.address+'"';
		requestsLogEntry += ',"'+this.method+'"';
		requestsLogEntry += ',"'+this.url.url+'"';
		requestsLogEntry += ',"'+this.referrer.url+'"';

		return requestsLogEntry;
	},

	getPublicErrorData: function() {
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
	},
	
});

Request.receiveNodeRequest = function(request, maximumRequestBodySizeInBytes) {
    return new Promise(function(resolve, reject) {
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
}