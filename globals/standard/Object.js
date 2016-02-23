// Instance methods

Object.prototype.isEmpty = function() {
    return Object.isEmpty(this);   
};

Object.prototype.hasKey = function(key) {
    return Object.hasKey(this, key);
};

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
        if(key && this[key] !== undefined) {
            result = this[key];
        }
    }

    return result;
};

Object.prototype.getValueByPath = function(path) {
    var keys = path.split('.');
    var value = null;
    var current = this;

    // Search for they key they specified
    for(var i = 0; i < keys.length; i++) {
        // If the key exists assign it
        if(current[keys[i]] !== undefined) {
            current = current[keys[i]];
        }
        // If the key does not exist, exit the loop
        else {
            current = null;
            break;
        }
    }

    // Set the value to return to be the last value found for the last key
    value = current;

    return value;
};

Object.prototype.setValueByPath = function(path, value) {
    var keys = path.split('.');
    var current = this;

    // Search for they key they specified
    for(var i = 0; i < keys.length; i++) {
        // If the key isn't set and it isn't the last, create an object
        if(!current[keys[i]] && i != keys.length - 1) {
            current[keys[i]] = {};
        }

        // If the key is the last key, set the value
        if(i == keys.length - 1) {
            current[keys[i]] = value;
        }
        // If the key is not the last key, set current to the most recent key and loop again
        else {
            current = current[keys[i]];
        }
    }

    return this;
};

Object.prototype.each = function(callback) {
    var context = this;

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
};

Object.prototype.clone = function() {
    return Object.clone(this);
};

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
            else if(this[objectToMergeKey] !== undefined && !Primitive.is(this[objectToMergeKey])) {
                this[objectToMergeKey] = this[objectToMergeKey].merge(objectToMergeValue);
            }
            // Recursively merge non-primitives
            else if(this[objectToMergeKey] !== undefined && !Primitive.is(this[objectToMergeKey])) {
                this[objectToMergeKey] = this[objectToMergeKey].merge(objectToMergeValue);
            }
            // Add any new keys not existing on "this"
            else if(this[objectToMergeKey] === undefined) {
                this[objectToMergeKey] = objectToMergeValue;
            }
        }.bind(this));
    }.bind(this));

    return this;
};

// The difference between integrate and merge is how arrays are handled.
// With merge, if you have a key which points to an array, merging the same key name pointing to
// a different array will just push that different onto one array.
// Integrate on the other hand, looks are objects in the array to be merged and merges those
// objects with the corresponding object on the same array index.
Object.prototype.integrate = function() {
    var objectsToIntegrate = [];

    // Gather the objects to merge
    for(var i = 0; i < arguments.length; i++) {
        if(arguments[i]) {
            objectsToIntegrate.push(arguments[i]);  
        }
    };

    // "this" merges any properties from the objects to merge that it does not already have
    objectsToIntegrate.each(function(objectToIntegrateIndex, objectToIntegrate) {
        objectToIntegrate.each(function(objectToIntegrateKey, objectToIntegrateValue) {
            // Overwrite any primitives
            if(this[objectToIntegrateKey] !== undefined && Primitive.is(this[objectToIntegrateKey])) {
                this[objectToIntegrateKey] = objectToIntegrateValue;
            }
            // Special case with handling keys pointing to arrays
            else if(this[objectToIntegrateKey] !== undefined && Array.is(this[objectToIntegrateKey])) {
                var integratedArray = [];

                for(var i = 0; i < this[objectToIntegrateKey].length; i++) {
                    // If the array being integrated has a matching index to this array
                    if(objectToIntegrateValue[i]) {
                        var integratedObject = this[objectToIntegrateKey][i].integrate(objectToIntegrateValue[i]);
                        integratedArray.push(integratedObject); 
                    }
                    // If the array being integrated does not have a matching index, just use this array element at the current index
                    else {
                        integratedArray.push(this[objectToIntegrateKey][i]);
                    }
                }

                // If there are more array elements in the object we are coalescing in add them
                if(this[objectToIntegrateKey].length < objectToIntegrateValue.length) {
                    for(var i = this[objectToIntegrateKey].length; i < objectToIntegrateValue.length; i++) {
                        integratedArray.push(objectToIntegrateValue[i]);
                    }
                }

                this[objectToIntegrateKey] = integratedArray;
            }
            // Recursively merge other non-primitives
            else if(this[objectToIntegrateKey] !== undefined && !Primitive.is(this[objectToIntegrateKey])) {
                this[objectToIntegrateKey] = this[objectToIntegrateKey].integrate(objectToIntegrateValue);
            }
            // Add any new keys not existing on "this"
            else if(this[objectToIntegrateKey] === undefined) {
                this[objectToIntegrateKey] = objectToIntegrateValue;
            }
        }.bind(this));
    }.bind(this));

    return this;
};

Object.prototype.sort = function() {
    var sorted = {};

    Object.keys(this).sort().each(function(index, key) {
        sorted[key] = this[key];
    }.bind(this));

    return sorted;
};

Object.prototype.toJson = function() {
    return Json.encode(this);
};

Object.prototype.toArray = function() {
    return Object.toArray(this);
};

// Static methods

Object.is = function(value) {
	return Object.prototype.toString.call(value) == '[object Object]';
};

Object.isEmpty = function(object) {
    if(object === null) {
        return true;
    }
    else if(object === undefined) {
        return true;
    }
    else if(object == '') {
        return true;
    }
	else if(Array.is(object) || String.is(object)) {
    	return object.length === 0;
    }

    return Object.keys(object).length === 0;
};

Object.hasKey = function(object, key) {
	return key in object;
};

Object.containsClassInstance = function(object) {
    var containsClassInstance = object.constructor.toString().startsWith('function Class()');

    if(!containsClassInstance && (Object.is(object) || Array.is(object))) {
        object.each(function(key, value) {
            containsClassInstance = Object.containsClassInstance(value);

            if(containsClassInstance) {
                return false; // break
            }
        });
    }

    return containsClassInstance;
};

Object.clone = function(value) {
    var clone;

    // Primitives are just cloned by assignment
    if(Primitive.is(value)) {
        clone = value;
    }
    // If the value is a class instance, use Object.create to clone the instance
    else if(Class.isInstance(value)) {
        clone = Object.create(value);
        for(var key in value) {
            clone[key] = Object.clone(value[key]);
        }
    }
    // If we have an array or object
    else if(value && typeof(value) === 'object') {
        // Start out with a simple array or object
        clone = Object.prototype.toString.call(value) === '[object Array]' ? [] : {};

        // Call Object.clone for each item in the array or object
        for(var key in value) {
        	if(value.hasOwnProperty(key)) {
        		clone[key] = Object.clone(value[key]);	
        	}
        }
    }
    // Functions are just cloned by assignment (do this down here?)
    else if(Function.is(value)) {
        clone = value;
    }
    else {
        Console.log(value);
        throw new Error('Value is not clonable.');
    }

    return clone;
};

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
};

// Export
module.exports = Object;