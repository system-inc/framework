Json = Class.extend({

	construct: function() {
	},

	encode: function(object) {
		return JSON.stringify(object);
	},

	decode: function(string) {
		return JSON.parse(string);
	}

});

// Static methods
Json.encode = Json.prototype.encode;
Json.decode = Json.prototype.decode;