Headers = Class.extend({

	headers: [],

	construct: function(string) {
	},

	constructFromNodeHeaders: function(nodeHeaders) {
		var headers = new Headers();

		if(nodeHeaders) {
			for(var key in nodeHeaders) {
				if(String.is(nodeHeaders[key])) {
					headers.create(key, nodeHeaders[key]);	
				}
			}	
		}
		
		return headers;
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

	set: function(key, value, caseSensitive) {
		return this.update(key, value, caseSensitive);
	},

	delete: function() {

	},

	addCookies: function(cookies) {
		cookies.cookies.each(function(index, cookie) {
			this.create('Set-Cookie', cookie.toHeaderString());
		}, this);
	},

	toArray: function() {
		var array = [];

		this.headers.each(function(index, header) {
			array.push([header.key, header.value]);
		}, this);

		return array;
	},
	
});

// Static methods
Headers.constructFromNodeHeaders = Headers.prototype.constructFromNodeHeaders;