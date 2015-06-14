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
		caseSensitive = caseSensitive === true ? true : false;
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
		caseSensitive = caseSensitive === true ? true : false;
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
		caseSensitive = caseSensitive === true ? true : false;
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

	delete: function(key, caseSensitive) {
		caseSensitive = caseSensitive === true ? true : false;

		var indexToDelete = null;
		this.headers.each(function (index, header) {
			if(caseSensitive) {
				if(key == header.key) {
					indexToDelete = index;
					return false; // break
				}	
			}
			else {
				if(key.lowercase() == header.key.lowercase()) {
					indexToDelete = index;
					return false; // break
				}	
			}
		});

		if(indexToDelete !== null) {
			this.headers.delete(indexToDelete);
		}

		return this.headers;
	},

	getCookies: function() {
		var cookies = new Cookies();

		this.headers.each(function(index, header) {
			if(header.key.lowercase() == 'set-cookie' || header.key.lowercase() == 'cookie') {
				cookies.add(Cookie.constructFromHeaderString(header.value));
			}
		});

		return cookies;
	},

	addCookies: function(cookies) {
		cookies.cookies.each(function(index, cookie) {
			this.create('Set-Cookie', cookie.toHeaderString());
		}.bind(this));
	},

	length: function() {
		return this.headers.length;
	},

	toArray: function() {
		var array = [];

		this.headers.each(function(index, header) {
			array.push([header.key, header.value]);
		}.bind(this));

		return array;
	},

	toObject: function() {
		var object = {};

		this.headers.each(function(index, header) {
			object[header.key] = header.value;
		}.bind(this));

		return object;
	},
	
});

// Static methods
Headers.constructFromNodeHeaders = Headers.prototype.constructFromNodeHeaders;

Headers.nodeRawHeadersToString = function(rawHeaders) {
	var rawHeadersString = '';

	for(var index = 0; index < rawHeaders.length; index++) {
		// Node is silly and uses even and odd numbers to specify key value pairs
		// Zeroth
	    if(index == 0) {
	    	rawHeadersString += rawHeaders[index]+': ';
	    }
	    // Odd
	    else if(index % 2) {
	    	rawHeadersString += rawHeaders[index];
	    }
	    // Even
	    else {
	    	rawHeadersString += "\n"+rawHeaders[index]+': ';
	    }
	}

	return rawHeadersString;
}