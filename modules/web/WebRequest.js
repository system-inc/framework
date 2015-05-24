WebRequest = Class.extend({

	method: 'GET',
	url: null,
	data: null,
	body: null,
	headers: new Headers(),
	cookies: new Cookies(),
	encoding: null, // Must use null encoding in order for gzipped responses to work

	construct: function(url, options) {
		// Make sure we are working with a URL object
		if(String.is(url)) {
			this.url = new Url(url);	
		}
		else {
			this.url = url;
		}

		if(options) {
			if(options.method) {
				this.method = options.method.uppercase();
			}
			if(options.encoding) {
				this.encoding = options.encoding;
			}
			if(options.data) {
				this.data = options.data;
			}
			if(options.body) {
				this.body = options.body;
			}
			if(options.headers) {
				options.headers.each(function(key, value) {
					this.headers.create(key, value);
				}.bind(this));
			}
			if(options.cookies) {
				options.cookies.each(function(key, value) {
					this.cookies.create(key, value);
				}.bind(this));
			}
		}

		//console.log(this.url);
		
		// If set, make sure body is a string
		if(this.body && !String.is(this.body)) {
			this.body = Json.encode(this.body);
		}

		// If data is set, method is GET, and no body, convert data to query parameters
		if(this.data && this.method == 'GET' && !this.body) {
			this.data.each(function(key, value) {
				//console.log('setting query param', key, value, this.url);
				this.url.setQueryParameter(key, value);
				//console.log('query param set', key, value, this.url);
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
			body: webRequest.body,
			headers: webRequest.headers.toObject(),
		};

		var response = yield Web.request(options);
		//Console.out(response);

		return response;
	},
	
});

// Static methods
WebRequest.execute = WebRequest.prototype.execute;