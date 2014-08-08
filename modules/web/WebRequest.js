WebRequest = Class.extend({

	url: null,

	construct: function(url) {
		this.url = new Url(url);
	},

	execute: function*() {
		var response = yield Web.request({
			method: 'GET',
			host: this.url.host,
			port: this.url.port,
			path: this.url.path,
		});
		//Console.out(response);

		return response;
	},
	
});

// Static methods
WebRequest.execute = WebRequest.prototype.execute;