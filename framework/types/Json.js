Json = Class.extend({

	construct: function() {
	},

	encode: function(object) {
		function censor(censor) {
			var i = 0;

			return function(key, value) {
				if(i !== 0 && typeof(censor) === 'object' && typeof(value) == 'object' && censor == value) 
					return '[Circular]'; 
				if(i >= 999) // seems to be a harded maximum of 30 serialized objects?
					return '[Unknown]';
				++i; // so we know we aren't using the original object anymore

				return value;  
			}
		}

		return JSON.stringify(object, censor(object));
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