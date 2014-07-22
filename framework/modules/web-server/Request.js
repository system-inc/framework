Request = Class.extend({

	id: null, // Unique identifier for the request
	url: null,
	method: null,
	headers: null,
	cookies: null,
	ipAddress: null,
	connectingIpAddress: null,
	referrer: null,
	browser: null,
	device: null,
	operatingSystem: null,
	geolocation: null,
	httpVersion: null,

	construct: function(nodeRequest) {
		// URL
		this.url = Url.constructFromNodeRequest(nodeRequest);

		// Method
		this.method = nodeRequest.method;

		// Headers
		this.headers = Headers.constructFromNodeHeaders(nodeRequest.headers);

		// Cookies
		this.cookies = new Cookies(this.headers.get('cookie'));

		// Content
		// this.content = {
		// 	'length': this.headers.get('content-length'),
		// 	'type': this.headers.get('type'),
		// };

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
	
});