Json = Class.extend({

	construct: function() {
	},

	encode: function(object) {
		return JSON.stringify(object);
	},

	decode: function(string) {
		return JSON.parse(string);
	},

	is: function(value) {
		return (String.is(value) && value.isJson());
	},

});

// Static methods
Json.encode = Json.prototype.encode;
Json.decode = Json.prototype.decode;
Json.is = Json.prototype.is;