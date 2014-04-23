Request = Class.extend({

	construct: function(nodeRequest) {
		// URL
		this.url = new Url.constructFromNodeRequest(nodeRequest);

		// Method
		this.method = nodeRequest.method;

		// Headers
		this.headers = nodeRequest.headers;

		// IP address
		this.ipAddress = this.connectingIpAddress = new IpAddress(nodeRequest.connection.remoteAddress);
		
		// Referrer
		this.referrer = new Url(this.getHeader('referer'));

		// Cookies
		this.cookies = new Cookies(this.getHeader('cookie'));

		// Cache the user agent
		var userAgent = this.getHeader('user-agent');

		// Revisit IP address to see if X-Forwarded-For is set
		var xForwardedFor = this.getHeader('x-forwarded-for');
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
		this.browser = new Browser.constructFromUserAgent(userAgent);

		// Device identification from user agent
		this.device = new Device.constructFromUserAgent(userAgent);

		// Operating system identification from user agent
		this.operatingSystem = new OperatingSystem.constructFromUserAgent(userAgent);

		// Geolocation (optionally provided by Cloudflare)
		this.geolocation = new Geolocation();
		this.geolocation.country.code = this.getHeader('cf-ipcountry');

		// HTTP version
		this.httpVersion = new Version({
			'major': nodeRequest.httpVersionMajor,
			'minor': nodeRequest.httpVersionMinor,
		});
	},

	getHeader: function(name) {
		return this.headers.getValueForKey(name, false);
	}
	
});