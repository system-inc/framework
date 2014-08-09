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

		var indentedJson = Json.encode(object, replacer, indentation);

		// Replace escaped new line characters with real new line characters and indentation
		indentedJson = indentedJson.replace(/\\n/g, "\n    ");

		return indentedJson;
	},

});

// Static methods
Json.encode = Json.prototype.encode;
Json.decode = Json.prototype.decode;
Json.is = Json.prototype.is;
Json.indent = Json.prototype.indent;