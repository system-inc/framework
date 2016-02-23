// Dependencies
var Header = Framework.require('modules/web/headers/Header.js');

// Class
var Cookie = Class.extend({

	key: null,
	value: null,

	construct: function(key, value) {
		this.key = key;
		this.value = value;
	},

	toHeader: function() {
		var header = new Header('Set-Cookie', this.toHeaderString());

		return header;
	},

	toHeaderString: function() {
		var headerString = this.key+'='+this.value+';';

		return headerString;
	},
	
});

// Static methods
Cookie.constructFromHeaderString = function(headerString) {
	var key = headerString.split('=').first();

	// TODO: This needs to be fixed
	var cookie = new Cookie(key, headerString);

	return cookie;
}

// Export
module.exports = Cookie;