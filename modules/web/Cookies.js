Cookies = Class.extend({

	cookies: [],

	construct: function(string) {
		if(string) {
			this.parse(string);	
		}
	},

	parse: function(string) {
		string.split(';').each(function(cookie) {
			if(!cookie.empty()) {
				var parts = cookie.split('=');
	        	this.cookies.push(new Cookie(parts.shift().trim(), unescape(parts.join('='))));
			}
		}, this);
	},

	get: function(key, caseSensitive) {
		caseSensitive = caseSensitive === false ? false : true;
		var cookie = null;

		if(caseSensitive) {
			for(var i = 0; i < this.cookies.length; i++) {
				if(this.cookies[i].key == key) {
					cookie = this.cookies[i].value;
					break;
				}
			}	
		}
		else {
			for(var i = 0; i < this.cookies.length; i++) {
				if(this.cookies[i].key.toLowerCase() == key.toLowerCase()) {
					cookie = this.cookies[i].value;
					break;
				}
			}
		}

		return cookie;
	},

	getCookie: function(key, caseSensitive) {
		caseSensitive = caseSensitive === false ? false : true;
		var cookie = null;

		if(caseSensitive) {
			for(var i = 0; i < this.cookies.length; i++) {
				if(this.cookies[i].key == key) {
					cookie = this.cookies[i].value;
					break;
				}
			}	
		}
		else {
			for(var i = 0; i < this.cookies.length; i++) {
				if(this.cookies[i].key.toLowerCase() == key.toLowerCase()) {
					cookie = this.cookies[i];
					break;
				}
			}
		}

		return cookie;
	},

	create: function(key, value) {
		var cookie = new Cookie(key, value);

		this.cookies.push(cookie);

		return cookie;
	},

	set: function(key, value, caseSensitive) {
		return this.update(key, value, caseSensitive);
	},

	update: function(key, value, caseSensitive) {
		caseSensitive = caseSensitive === false ? false : true;
		var cookie = this.getCookie(key, false);

		if(cookie != null) {
			cookie.value = value;
		}
		else {
			cookie = this.create(key, value);
		}

		return cookie;
	},

	delete: function() {

	},
	
});