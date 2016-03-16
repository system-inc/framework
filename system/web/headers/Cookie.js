// Dependencies
var Header = Framework.require('system/web/headers/Header.js');

// Class
var Cookie = Class.extend({

	key: null,
	value: null,

	construct: function(key, value) {
		this.key = key;

		if(Primitive.is(value)) {
			this.value = value;
		}
		else {
			this.value = Json.encode(value);
		}
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
	var headerStringArray = headerString.split('=');
	var key = headerStringArray.first();

	// Remove the first item (the key)
	headerStringArray.delete(0);
	var value = headerStringArray.join('=').replaceLast(';', '');

	// TODO: This needs to be fixed
	var cookie = new Cookie(key, value);

	return cookie;
}

// Export
module.exports = Cookie;