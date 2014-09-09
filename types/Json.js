Json = Class.extend({

	construct: function() {
	},

	encode: function(object, replacer, indentation) {
		//return NodeUtility.inspect(object);
		return JSON.stringify(Json.decycle(object), replacer, indentation);
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

	decycle: function decycle(object) {
		// Make a deep copy of an object or array, assuring that there is at most
		// one instance of each object or array in the resulting structure. The
		// duplicate references (which might be forming cycles) are replaced with
		// an object of the form
		//      {$ref: PATH}
		// where the PATH is a JSONPath string that locates the first occurance.
		// So,
		//      var a = [];
		//      a[0] = a;
		//      return JSON.stringify(Json.decycle(a));
		// produces the string '[{"$ref":"$"}]'.

		// JSONPath is used to locate the unique object. $ indicates the top level of
		// the object or array. [NUMBER] or [STRING] indicates a child member or
		// property.

		var objects = [], // Keep a reference to each unique object or array
		paths = []; // Keep the path to each unique object or array

		return (function derez(value, path) {
			// The derez recurses through the object, producing the deep copy.
			var i, // The loop counter
			name, // Property name
			nu; // The new object or array

			// typeof null === 'object', so go on if this value is really an object but not
			// one of the weird builtin objects.
			if(
				typeof value === 'object' &&
				value !== null &&
				!(value instanceof Boolean) &&
				!(value instanceof Date) &&
				!(value instanceof Number) &&
				!(value instanceof RegExp) &&
				!(value instanceof String)
			) {
				// If the value is an object or array, look to see if we have already
				// encountered it. If so, return a $ref/path object. This is a hard way,
				// linear search that will get slower as the number of unique objects grows.
				for(i = 0; i < objects.length; i += 1) {
					if(objects[i] === value) {
						return {$ref: paths[i]};
					}
				}

				// Otherwise, accumulate the unique value and its path.
				objects.push(value);
				paths.push(path);

				// If it is an array, replicate the array.
				if(Object.prototype.toString.apply(value) === '[object Array]') {
					nu = [];
					for(i = 0; i < value.length; i += 1) {
						nu[i] = derez(value[i], path + '[' + i + ']');
					}
				}
				else {
					// If it is an object, replicate the object.
					nu = {};
					for(name in value) {
						if(Object.prototype.hasOwnProperty.call(value, name)) {
							nu[name] = derez(value[name],
							path + '[' + JSON.stringify(name) + ']');
						}
					}
				}
				
				return nu;
			}

			return value;
		}(object, '$'));
	},

	retrocycle: function retrocycle($) {
		// Restore an object that was reduced by decycle. Members whose values are
		// objects of the form
		//      {$ref: PATH}
		// are replaced with references to the value found by the PATH. This will
		// restore cycles. The object will be mutated.

		// The eval function is used to locate the values described by a PATH. The
		// root object is kept in a $ variable. A regular expression is used to
		// assure that the PATH is extremely well formed. The regexp contains nested
		// * quantifiers. That has been known to have extremely bad performance
		// problems on some browsers for very long strings. A PATH is expected to be
		// reasonably short. A PATH is allowed to belong to a very restricted subset of
		// Goessner's JSONPath.

		// So,
		//      var s = '[{"$ref":"$"}]';
		//      return Json.retrocycle(JSON.parse(s));
		// produces an array containing a single element which is the array itself.
		var px = /^\$(?:\[(?:\d+|\"(?:[^\\\"\u0000-\u001f]|\\([\\\"\/bfnrt]|u[0-9a-zA-Z]{4}))*\")\])*$/;

		(function rez(value) {
			// The rez function walks recursively through the object looking for $ref
			// properties. When it finds one that has a value that is a path, then it
			// replaces the $ref object with a reference to the value that is found by
			// the path.
			var i, item, name, path;

			if(value && typeof value === 'object') {
				if(Object.prototype.toString.apply(value) === '[object Array]') {
					for(i = 0; i < value.length; i += 1) {
						item = value[i];
						if(item && typeof item === 'object') {
							path = item.$ref;
							if(typeof path === 'string' && px.test(path)) {
								value[i] = eval(path);
							}
							else {
								rez(item);
							}
						}
					}
				}
				else {
					for(name in value) {
						if(typeof value[name] === 'object') {
							item = value[name];
							if(item) {
								path = item.$ref;
								if(typeof path === 'string' && px.test(path)) {
									value[name] = eval(path);
								}
								else {
									rez(item);
								}
							}
						}
					}
				}
			}
		}($));

		return $;
	},

});

// Static methods
Json.encode = Json.prototype.encode;
Json.decode = Json.prototype.decode;
Json.is = Json.prototype.is;
Json.indent = Json.prototype.indent;
Json.decycle = Json.prototype.decycle;
Json.retrocycle = Json.prototype.retrocycle;