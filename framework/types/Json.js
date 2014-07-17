Json = Class.extend({

	construct: function() {
	},

	encode: function(object, replacer, indentation) {
		return JSON.stringify(object, replacer, indentation);
	},

	decode: function(string) {
		return JSON.parse(string);
	},

	is: function(value) {
		return (String.is(value) && value.isJson());
	},

	indent: function(object, replacer, indentation) {
		indentation = (indentation === undefined ? 4 : indentation);

		return Json.encode(object, replacer, indentation);
	},

});

// Static methods
Json.encode = Json.prototype.encode;
Json.decode = Json.prototype.decode;
Json.is = Json.prototype.is;
Json.indent = Json.prototype.indent;