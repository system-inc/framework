// Instance methods

Object.defineProperty(Object.prototype, 'getKeys', {
    writable: true, // Let other libraries replace this method
    enumerable: false,
    value: function() {
        return Object.keys(this);
    }
});

Object.defineProperty(Object.prototype, 'getSize', {
    writable: true, // Let other libraries replace this method
    enumerable: false,
    value: function() {
        return Object.keys(this).length;
    },
});

Object.defineProperty(Object.prototype, 'isEmpty', {
    writable: true, // Let other libraries replace this method
    enumerable: false,
    value: function() {
        return Object.isEmpty(this);
    },
});

Object.defineProperty(Object.prototype, 'hasKey', {
    writable: true, // Let other libraries replace this method
    enumerable: false,
    value: function(key) {
        return Object.hasKey(this, key);
    },
});

Object.defineProperty(Object.prototype, 'random', {
    writable: true, // Let other libraries replace this method
    enumerable: false,
    value: function(key) {
        return this[Object.keys(this).random()];
    },
});

Object.defineProperty(Object.prototype, 'getValueForKey', {
    writable: true, // Let other libraries replace this method
    enumerable: false,
    value: function(key, caseSensitive) {
        caseSensitive = caseSensitive === false ? false : true;
        var result = null;

        if(!caseSensitive) {
            if(key && this[key] !== undefined) {
                result = this[key];
            }
            else if(key && this[key.lowercase()] !== undefined) {
                result = this[key.lowercase()];
            }
        }
        else {
            if(key && this[key] !== undefined) {
                result = this[key];
            }
        }

        return result;
    },
});

Object.defineProperty(Object.prototype, 'getValueByPath', {
    writable: true, // Let other libraries replace this method
    enumerable: false,
    value: function(path) {
        var keys = path.split('.');
        var value = null;
        var current = this;

        // Search for they key they specified
        for(var i = 0; i < keys.length; i++) {
            // If the key exists assign it
            if(current[keys[i]] !== undefined) {
                current = current[keys[i]];

                if(current === null) {
                    break;
                }
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
    },
});

Object.defineProperty(Object.prototype, 'setValueByPath', {
    writable: true, // Let other libraries replace this method
    enumerable: false,
    value: function(path, value) {
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
    },
});

Object.defineProperty(Object.prototype, 'deleteValueByPath', {
    writable: true, // Let other libraries replace this method
    enumerable: false,
    value: function(path) {
        var keys = path.split('.');
        var current = this;

        // Search for they key they specified
        for(var i = 0; i < keys.length; i++) {
            // If the key isn't set and it isn't the last
            if(!current[keys[i]] && i != keys.length - 1) {
                // Break out of the loop as there will be no value to delete
                break;
            }

            // If the key is the last key, delete the value
            if(i == keys.length - 1) {
                delete current[keys[i]];
            }
            // If the key is not the last key, set current to the most recent key and loop again
            else {
                current = current[keys[i]];
            }
        }

        return this;
    },
});

Object.defineProperty(Object.prototype, 'each', {
    writable: true, // Let other libraries replace this method
    enumerable: false,
    value: function(callback) {
        var context = this;
        var promiseFromFirstItemCallback = null;
        var objectKeys = Object.keys(this);

        // Start out with a standard for loop
        for(var i = 0; i < objectKeys.length; i++) {
            var advance = callback.apply(context, [objectKeys[i], this[objectKeys[i]], this]);

            // If the callback on the first item returns a Promise, break
            if(i == 0 && Promise.is(advance)) {
                promiseFromFirstItemCallback = advance;
                break;
            }

            // If the callback returns false, break out of the for loop
            if(advance === false) {
                break;
            }
        }

        // If the callback for the first item returned a Promise
        if(promiseFromFirstItemCallback) {
            //console.log('FUNCTION IS ASYNC');

            // Keep track of the object
            var object = this;

            // This top level promise resolves after all object keys have been looped over
            return new Promise(async function(resolve) {
                // Wait for the first item's Promise to resolve
                var resolvedValueFromPromiseFromFirstItemCallback = await promiseFromFirstItemCallback;

                // If the return value from the Promise from the first item is false, do not do anything
                if(resolvedValueFromPromiseFromFirstItemCallback === false) {
                }
                else {
                    // Use a for loop here instead of .each so I can use await below
                    // Start the loop on the second item
                    for(var i = 1; i < objectKeys.length; i++) {
                        // Await on a sub promise which resolves when the async callback for the current object key completes
                        var advance = await new Promise(async function(subResolve) {
                            // Run the async callback for the current object key, resolve the sub promise when complete
                            var callbackReturnValue = await callback.apply(context, [objectKeys[i], object[objectKeys[i]], object]);
                            subResolve(callbackReturnValue);
                        });

                        // If the callback returns false, break out of the for loop
                        if(advance === false) {
                            break;
                        }
                    }
                }

                resolve();
            });
        }
    },
});

Object.defineProperty(Object.prototype, 'clone', {
    writable: true, // Let other libraries replace this method
    enumerable: false,
    value: function() {
        return Object.clone(this);
    },
});

// Inherit recursively adds properties and but does not overwrite existing non-null properties
// on the object with data from another object. Important: This method will overwrite null values.
Object.defineProperty(Object.prototype, 'inherit', {
    writable: true, // Let other libraries replace this method
    enumerable: false,
    value: function() {
        var objectsToInherit = [];

        // Gather the objects to merge
        for(var i = 0; i < arguments.length; i++) {
            if(arguments[i]) {
                objectsToInherit.append(arguments[i]);
            }
        }

        // "this" inherits any properties from the objects to inherit that it does not already have
        objectsToInherit.each(function(objectToInheritIndex, objectToInherit) {
            objectToInherit.each(function(objectToInheritKey, objectToInheritValue) {
                // Recursively inherit non-primitives
                if(this[objectToInheritKey] !== undefined && !Primitive.is(this[objectToInheritKey])) {
                    this[objectToInheritKey] = this[objectToInheritKey].inherit(objectToInheritValue);
                }
                // Add any new keys not existing on "this", replace ones which are null
                else if(this[objectToInheritKey] === undefined || this[objectToInheritKey] === null) {
                    this[objectToInheritKey] = objectToInheritValue;
                }
            }.bind(this));
        }.bind(this));

        return this;
    },
});

// Merge adds new data and overwrites existing data on the object with data from another object
Object.defineProperty(Object.prototype, 'merge', {
    writable: true, // Let other libraries replace this method
    enumerable: false,
    value: function() {
        var objectsToMerge = [];

        // Gather the objects to merge
        for(var i = 0; i < arguments.length; i++) {
            if(arguments[i]) {
                objectsToMerge.append(arguments[i]);
            }
        }

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
            }.bind(this));
        }.bind(this));

        return this;
    },
});

// The difference between integrate and merge is how arrays are handled.
// With merge, if you have a key which points to an array, merging the same key name pointing to
// a different array will just append that different onto one array.
// Integrate on the other hand, looks are objects in the array to be merged and merges those
// objects with the corresponding object on the same array index.
Object.defineProperty(Object.prototype, 'integrate', {
    writable: true, // Let other libraries replace this method
    enumerable: false,
    value: function() {
        var objectsToIntegrate = [];

        // Gather the objects to merge
        for(var i = 0; i < arguments.length; i++) {
            if(arguments[i]) {
                objectsToIntegrate.append(arguments[i]);
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
                            integratedArray.append(integratedObject);
                        }
                        // If the array being integrated does not have a matching index, just use this array element at the current index
                        else {
                            integratedArray.append(this[objectToIntegrateKey][i]);
                        }
                    }

                    // If there are more array elements in the object we are coalescing in add them
                    if(this[objectToIntegrateKey].length < objectToIntegrateValue.length) {
                        for(var i = this[objectToIntegrateKey].length; i < objectToIntegrateValue.length; i++) {
                            integratedArray.append(objectToIntegrateValue[i]);
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
    },
});

Object.defineProperty(Object.prototype, 'sort', {
    writable: true, // Let other libraries replace this method
    enumerable: false,
    value: function() {
        var sorted = {};

        Object.keys(this).sort().each(function(index, key) {
            // Recursively sort objects
            if(Object.is(this[key])) {
                sorted[key] = this[key].sort();
            }
            // Recursively sort objects in arrays
            else if(Array.is(this[key])) {
                var arrayWithSortedObjects = [];
                for(let i = 0; i < this[key].length; i++) {
                    if(Object.is(this[key][i])) {
                        arrayWithSortedObjects.push(this[key][i].sort());
                    }
                    else {
                        arrayWithSortedObjects.push(this[key][i]);
                    }
                }
                sorted[key] = arrayWithSortedObjects;
            }
            // Set the key which will be in the right order
            else {
                sorted[key] = this[key];
            }
        }.bind(this));

        return sorted;
    },
});

Object.defineProperty(Object.prototype, 'toJson', {
    writable: true, // Let other libraries replace this method
    enumerable: false,
    value: function() {
        return Json.encode(this);
    },
});

Object.defineProperty(Object.prototype, 'toArray', {
    writable: true, // Let other libraries replace this method
    enumerable: false,
    value: function() {
        return Object.toArray(this);
    },
});

// Static methods

Object.defineProperty(Object, 'is', {
    writable: true, // Let other libraries replace this method
    enumerable: false,
    value: function(value) {
        return Object.prototype.toString.call(value) == '[object Object]';
    },
});

Object.defineProperty(Object, 'isEmpty', {
    writable: true, // Let other libraries replace this method
    enumerable: false,
    value: function(object) {
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
    },
});

Object.defineProperty(Object, 'hasKey', {
    writable: true, // Let other libraries replace this method
    enumerable: false,
    value: function(object, key) {
        return key in object;
        //return object.hasOwnProperty(key);
    },
});

Object.defineProperty(Object, 'containsClassInstance', {
    writable: true, // Let other libraries replace this method
    enumerable: false,
    value: function(object) {
        throw new Error('this needs to be fixed for my es6 changes');
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
    },
});

Object.defineProperty(Object, 'clone', {
    writable: true, // Let other libraries replace this method
    enumerable: false,
    value: function(value) {
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
            console.log(value);
            throw new Error('Value is not clonable.');
        }

        return clone;
    },
});

Object.defineProperty(Object, 'toArray', {
    writable: true, // Let other libraries replace this method
    enumerable: false,
    value: function(value) {
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
    },
});

// Turn any key_like_this to keyLikeThis
Object.defineProperty(Object, 'keysToCamelCase', {
    writable: true, // Let other libraries replace this method
    enumerable: false,
    value: function(object) {
        var objectWithCamelCaseKeys = {};

        for(let key in object) {
            // Recurse through children
            let value = object[key];

            // Handle objects
            if(Object.is(value)) {
                value = Object.keysToCamelCase(value);
            }
            // Handle arrays of objects
            else if(Array.is(value)) {
                for(let i = 0; i < value.length; i++) {
                    if(Object.is(value[i])) {
                        value[i] = Object.keysToCamelCase(value[i]);
                    }
                }
            }

            objectWithCamelCaseKeys[key.toCamelCase()] = value;
        }

        return objectWithCamelCaseKeys;
    },
});
