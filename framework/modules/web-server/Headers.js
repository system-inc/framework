Headers = Class.extend({

	construct: function(string) {
		this.headers = [];
		this.cookies = null;

		this.parse(string);
	},

	constructFromNodeHeaders: function(nodeHeaders) {
		var headers = new Headers();

		for(var key in nodeHeaders) {
			if(nodeHeaders[key].isString()) {
				headers.create(key, nodeHeaders[key]);	
			}
		}

		return headers;
	},

	parse: function(string) {
		var self = this;
		if(string) {
			string.split(';').forEach(function(header) {
		        var parts = cookie.split('=');
		        self.cookies.push(new Cookie(parts.shift().trim(), unescape(parts.join('='))));
	    	});
		}
	},

	get: function(key, caseSensitive) {
		caseSensitive = caseSensitive === false ? false : true;
		var header = null;

		if(caseSensitive) {
			for(var i = 0; i < this.headers.length; i++) {
				if(this.headers[i].key == key) {
					header = this.headers[i].value;
					break;
				}
			}	
		}
		else {
			for(var i = 0; i < this.headers.length; i++) {
				if(this.headers[i].key.toLowerCase() == key.toLowerCase()) {
					header = this.headers[i].value;
					break;
				}
			}
		}

		return header;
	},

	getHeader: function(key, caseSensitive) {
		caseSensitive = caseSensitive === false ? false : true;
		var header = null;

		if(caseSensitive) {
			for(var i = 0; i < this.headers.length; i++) {
				if(this.headers[i].key == key) {
					header = this.headers[i].value;
					break;
				}
			}	
		}
		else {
			for(var i = 0; i < this.headers.length; i++) {
				if(this.headers[i].key.toLowerCase() == key.toLowerCase()) {
					header = this.headers[i];
					break;
				}
			}
		}

		return header;
	},

	create: function(key, value) {
		var header = new Header(key, value);

		this.headers.push(header);

		return header;
	},

	update: function(key, value, caseSensitive) {
		caseSensitive = caseSensitive === false ? false : true;
		var header = this.getHeader(key, false);

		if(header != null) {
			header.value = value;
		}
		else {
			header = this.create(key, value);
		}

		return header;
	},	

	delete: function() {

	},

	toArray: function() {
		var array = [];

		for(var i = 0; i < this.headers.length; i++) {
			array.push([this.headers[i].key, this.headers[i].value]);
		}

		// Handle cookies
		if(this.cookies.cookies.length > 0) {
			for(var i = 0; i < this.cookies.cookies.length; i++) {
				array.push(['Set-Cookie', this.cookies.cookies[i].toHeaderString()]);
			}			
		}

		return array;
	},
	
});

// Static methods
Headers.constructFromNodeHeaders = Headers.prototype.constructFromNodeHeaders;