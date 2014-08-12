Json = Class.extend({

	construct: function() {
	},

	encode: function(object, replacer, indentation) {
		//return NodeUtility.inspect(object);

		var keyCache = [];
		var objectCache = [];

		if(replacer === undefined) {


			// NOTES
			// Check out cycle and decycle
			// Allow an object to be printed multiple (3) times before calling circular on it


			// Prevent "TypeError: Converting circular structure to JSON"
			replacer = function(key, value) {
				// Always permit the root element
				if(key == '') {
					return value;
				}
				// Always permit primitives
				else if(Object.isPrimitive(value)) {
					return value;
				}
				// Check non-primitives
				else if(objectCache.indexOf(value) !== -1) {
					return '[Already Printed]';
				}
				else {
					objectCache.push(value);

					return value;
				}
			}
		}
		
		var encodedJson = JSON.stringify(object, replacer, indentation);

		// Allow caches to be garbage collected
		keyCache = null;
		objectCache = null;

		return encodedJson;
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