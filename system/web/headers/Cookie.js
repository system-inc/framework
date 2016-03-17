// Dependencies
var Header = Framework.require('system/web/headers/Header.js');

// Class
var Cookie = Class.extend({

	key: null,
	value: null,

	construct: function(key, value) {
		this.key = key;

		// Decode JSON strings into objects
		if(Json.is(value)) {
			this.value = Json.decode(value);
		}
		else {
			this.value = value;	
		}
	},

	toHeader: function() {
		var header = new Header('Set-Cookie', this.toHeaderString());

		return header;
	},

	toHeaderString: function() {
		var value = this.value;

		// Encode non-primitives into JSON strings
		if(!Primitive.is(this.value)) {
			value = Json.encode(this.value);
		}

		var headerString = this.key+'='+value+';';

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

	var cookie = new Cookie(key, value);

	return cookie;
}

// Export
module.exports = Cookie;