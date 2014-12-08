Json = {};

Json.is = function(value) {
	var is = false;

	if(String.is(value)) {
		try {
	        var object = JSON.parse(value);

	        // Handle non-exception-throwing cases:
	        // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
	        // but JSON.parse(null) returns 'null', and typeof(null) === "object", so we must check for that, too.
	        if(object && typeof(object) === "object" && object !== null) {
	            is = true;
	        }
	    }
	    catch(exception) {
	    }
	}

    return is;
}

Json.encode = function(object, replacer, indentation) {
	if(!object) {
		return '';
	}

	//return Node.Utility.inspect(object);
	return JSON.stringify(Json.decycle(object), replacer, indentation);
}

Json.decode = function(string) {
	if(!string) {
		return null;
	}

	return JSON.parse(string);
}

Json.indent = function(object, replacer, indentation) {
	indentation = (indentation === undefined ? 4 : indentation);

	var indentedJson = Json.encode(object, replacer, indentation);

	// Replace escaped new line characters with real new line characters and indentation
	if(indentedJson) {
		indentedJson = indentedJson.replace(/\\n/g, "\n    ");	
	}	

	return indentedJson;
}

/*
	Make a deep copy of an object or array, assuring that there is at most one instance of each object or array in the resulting structure.
	The duplicate references (which might be forming cycles) are replaced with an object of the form

		{$reference: PATH}

	where the PATH is a JSONPath string that locates the first occurance. So,

	    var a = [];
	    a[0] = a;
	    return JSON.stringify(Json.decycle(a));

	produces the string

		'[{"$reference":"$"}]'.

	JSONPath is used to locate the unique object. $ indicates the top level of the object or array. [NUMBER] or [STRING] indicates a child member or property.
*/
Json.decycle = function(objectToDecycle) {
	var objects = []; // Keep a reference to each unique object or array
	var paths = []; // Keep the path to each unique object or array

	// The decycle function recurses through the object, producing the deep copy
	return (function decycle(value, path) {
		var i; // The loop counter
		var key; // Property name
		var decycledValue; // The new object or array

		// typeof null === 'object', so go on if this value is really an object but not one of the weird builtin objects
		if(
			typeof value === 'object' &&
			value !== null &&
			!(value instanceof Boolean) &&
			!(value instanceof Date) &&
			!(value instanceof Number) &&
			!(value instanceof RegExp) &&
			!(value instanceof String)
		) {
			// If the value is an object or array, look to see if we have already encountered it
			for(i = 0; i < objects.length; i += 1) {
				// If so, return a $reference/path object
				if(objects[i] === value) {
					return {
						$reference: paths[i]
					};
				}
			}

			// Otherwise, accumulate the unique value and its path
			objects.push(value);
			paths.push(path);

			// If it is an array, replicate the array
			if(Object.prototype.toString.apply(value) === '[object Array]') {
				decycledValue = [];
				for(i = 0; i < value.length; i += 1) {
					decycledValue[i] = decycle(value[i], path + '[' + i + ']');
				}
			}
			else {
				// If it is an object, replicate the object
				decycledValue = {};
				for(key in value) {
					if(Object.prototype.hasOwnProperty.call(value, key)) {
						decycledValue[key] = decycle(value[key], path + '[' + JSON.stringify(key) + ']');
					}
				}
			}
			
			return decycledValue;
		}

		return value;
	}(objectToDecycle, '$'));
}

/*
	Restore an object that was reduced by decycle. Members whose values are objects of the form

		{$reference: PATH}

	are replaced with references to the value found by the PATH. This will restore cycles. The object will be mutated.

	The eval function is used to locate the values described by a PATH. The root object is kept in a $ variable. A regular expression is used to
	assure that the PATH is extremely well formed. The regexp contains nested * quantifiers. That has been known to have extremely bad performance
	problems on some browsers for very long strings. A PATH is expected to be reasonably short. A PATH is allowed to belong to a very restricted
	subset of Goessner's JSONPath.

	So,

		var s = '[{"$reference":"$"}]';
		return Json.retrocycle(JSON.parse(s));

	produces an array containing a single element which is the array itself.
*/
Json.retrocycle = function($) {
	var wellFormedPathRegularExpression = /^\$(?:\[(?:\d+|\"(?:[^\\\"\u0000-\u001f]|\\([\\\"\/bfnrt]|u[0-9a-zA-Z]{4}))*\")\])*$/;

	(function retrocycle(value) {
		// The retrocycle function walks recursively through the object looking for $reference properties
		// When it finds one that has a value that is a path, then it replaces the $reference object with a reference to the value that is found by the path
		var i;
		var item;
		var name;
		var path;

		if(value && typeof value === 'object') {
			if(Object.prototype.toString.apply(value) === '[object Array]') {
				for(i = 0; i < value.length; i += 1) {
					item = value[i];
					if(item && typeof item === 'object') {
						path = item.$reference;
						if(typeof path === 'string' && wellFormedPathRegularExpression.test(path)) {
							value[i] = eval(path);
						}
						else {
							retrocycle(item);
						}
					}
				}
			}
			else {
				for(name in value) {
					if(typeof value[name] === 'object') {
						item = value[name];
						if(item) {
							path = item.$reference;
							if(typeof path === 'string' && wellFormedPathRegularExpression.test(path)) {
								value[name] = eval(path);
							}
							else {
								retrocycle(item);
							}
						}
					}
				}
			}
		}
	}($));

	return $;
}