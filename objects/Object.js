Object.prototype.sort = function() {
	var sorted = {};

	Object.keys(this).sort().each(function(index, key) {
		sorted[key] = this[key];
	}, this);

	return sorted;
}

Object.prototype.each = function(callback, context) {
	// If the callback is not a generator, use a standard for loop
	if(!Function.isGenerator(callback)) {
		var objectKeys = Object.keys(this);
		for(var i = 0; i < objectKeys.length; i++) {
			var advance = callback.apply(context, [objectKeys[i], this[objectKeys[i]], this]);

			// If the callback returns false, break out of the for loop
			if(advance === false) {
				break;
			}
		}
	}
	// If the callback is a generator, work some inception magic
	else {
		// Keep track of the object
		var object = this;

		// This top level promise resolves after all object keys have been looped over
	    return new Promise(function(resolve) {
	    	// Run an anonymous generator function which loops over each object key, allowing me to yield on a sub promise
	    	Generator.run(function*() {
	    		var objectKeys = Object.keys(object);

	    		// Use a for loop here instead of .each so I can use yield below
		    	for(var i = 0; i < objectKeys.length; i++) {
		    		// Yield on a sub promise which resolves when the generator callback for the current object key completes
		   			var advance = yield new Promise(function(subResolve) {
		   				// Invoke and run the generator callback for the current object key, resolve the sub promise when complete
						Generator.run(callback.apply(context, [objectKeys[i], object[objectKeys[i]], object]), subResolve);
					});

					// If the callback returns false, break out of the for loop
					if(advance === false) {
						break;
					}
		    	}
	    	}, resolve);
	    });
	}	
}

Object.clone = function(object) {
	var clone = object;
 
    if(object && typeof(object) === 'object') {
        clone = Object.prototype.toString.call(object) === '[object Array]' ? [] : {};
        for(var key in object) {
        	// This code 
        	if(object.hasOwnProperty(key)) {
        		clone[key] = Object.clone(object[key]);	
        	}
        }
    }
 
    return clone;
}

Object.prototype.merge = function() {
    var objectsToMerge = [];

    // Gather the objects to merge
    for(var i = 0; i < arguments.length; i++) {
    	if(arguments[i]) {
    		objectsToMerge.push(arguments[i]);	
    	}
    };

    // "this" merges any properties from the objects to merge that it does not already have
    objectsToMerge.each(function(objectToMergeIndex, objectToMerge) {
    	objectToMerge.each(function(objectToMergeKey, objectToMergeValue) {
    		// Overwrite any primitives
    		if(this[objectToMergeKey] !== undefined && Primitive.is(this[objectToMergeKey])) {
    			this[objectToMergeKey] = objectToMergeValue;
    		}
    		// Recursively merge non-primitives
    		else if(this[objectToMergeKey] !== undefined && !Primitive.is(this[objectToMergeKey])) {
    			this[objectToMergeKey] = this[objectToMergeKey].merge(objectToMergeValue);
    		}
    		// Add any new keys not existing on "this"
    		else if(this[objectToMergeKey] === undefined) {
    			this[objectToMergeKey] = objectToMergeValue;
    		}
    	}, this);
    }, this);

    return this;
}

Object.is = function(value) {
	return typeof(value) == 'object';
}

Object.prototype.isEmpty = function() {
    return Object.keys(this).length === 0;
}

Object.prototype.toStringStandard = Object.prototype.toString;

// TODO: 2014-11-05 - This doesn't seem to be doing anything, remove if everything still works after all tests are written
// If we do remove prototype.toString, then we can go rename all instances of prototype.toStringStandard to just prototype.toString
// and the "Object.prototype.toStringStandard = Object.prototype.toString;" line above

//Object.prototype.toString = function() {
//	// Debugging
//	if(this.toStringStandard) {
//		return this.toStringStandard();	
//	}
//	else {
//		return this.toString();
//	}
//}

Object.prototype.toJson = function() {
	return Json.encode(this);
}

Object.prototype.toArray = function() {
	return Object.toArray(this);
}

Object.toArray = function(value) {
	// Wrap anything not in an array in an array
	if(!Array.is(value)) {
		if(String.is(value)) {
			return [value.toString()]; // Do this to make sure we are working with string literals and not "String" objects
		}
		else {
			return [value];
		}
	}
	else {
		return value;
	}
}

Object.prototype.getValueForKey = function(key, caseSensitive) {
	caseSensitive = caseSensitive === false ? false : true;
	var result = null;

	if(!caseSensitive) {
		for(var currentKey in this) {
			if(currentKey.toLowerCase() == key.toLowerCase()) {
				result = this[key];
				break;
			}
		}
	}
	else {
		if(key && this[key]) {
			result = this[key];
		}
	}

	return result;
}