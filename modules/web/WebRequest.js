WebRequest = Class.extend({

	url: null,
	options: null,

	construct: function(url, options) {
		// Make sure we are working with a URL object
		if(String.is(url)) {
			this.url = new Url(url);	
		}
		else {
			this.url = url;
		}
		
		this.options = {
			method: 'GET',
			host: this.url.host,
			port: this.url.port,
			path: this.url.path+this.url.queryString,
			encoding: null, // Must use null encoding in order for gzipped responses to work
			body: null,
			headers: {},
		};
		this.options.merge(options);
	},

	execute: function*() {
		//console.log(this.url);
		
		// If set, make sure body is a string
		if(this.options.body && !String.is(this.options.body)) {
			this.options.body = Json.encode(this.options.body);
		}

		// Set the Content-Length header
		this.options.headers['Content-Length'] = this.options.body && this.options.body.length ? this.options.body.length : 0;
		
		// Accept gzip encoding by default
		this.options.headers['Accept-Encoding'] = 'gzip';

		var response = yield Web.request(this.options);
		//Console.out(response);

		return response;
	},
	
});

// Static methods
WebRequest.execute = WebRequest.prototype.execute;