Cookies = Class.extend({

	construct: function(string) {
		this.cookies = [];

		this.parse(string);
	},

	parse: function(string) {
		var self = this;
		if(string) {
			string.split(';').forEach(function(cookie) {
		        var parts = cookie.split('=');
		        self.cookies.push(new Cookie(parts.shift().trim(), unescape(parts.join('='))));
	    	});
		}
	},

	get: function(key) {
		var cookie = null;

		for(var i = 0; i < this.cookies.length; i++) {
			if(this.cookies[i].key == key) {
				cookie = this.cookies[i].value;
				break;
			}
		}

		return cookie;
	},

	create: function(key, value) {
		var cookie = new Cookie(key, value);

		this.cookies.push(cookie);

		return cookie;
	},

	update: function() {

	},


	delete: function() {

	},
	
});