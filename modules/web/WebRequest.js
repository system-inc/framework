WebRequest = Class.extend({

	url: null,
	options: null,

	construct: function(url, options) {
		this.url = new Url(url);
		this.options = {
			method: 'GET',
			host: this.url.host,
			port: this.url.port,
			path: this.url.path,
			encoding: 'utf8',
		};
		this.options.merge(options);
	},

	execute: function*() {
		var response = yield Web.request(this.options);
		//Console.out(response);

		return response;
	},
	
});

// Static methods
WebRequest.execute = WebRequest.prototype.execute;