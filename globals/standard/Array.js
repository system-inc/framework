// Instance methods

Array.prototype.clone = function() {
	return Array.clone(this);
};

Array.prototype.unique = function() {
	return Array.unique(this);
};

Array.prototype.sortObjectsByKeyValue = function(keyName, direction) {
	if(direction === undefined) {
		direction = 'ascending';
	}

	// Ascending, smallest to largest (default)
	if(direction == 'ascending') {
		this.sort(function(a, b) {
			return a[keyName] > b[keyName];
		});
	}
	// Descending, largest to smallest
	else if(direction == 'descending') {
		this.sort(function(a, b) {
			return b[keyName] < a[keyName];
		});
	}

	return this;
};

// Options
/*
	[
		{
			'key': 'keyName', // sort by this first
			'direction': 'descending',
		},
		{
			'key': 'keyName', // then by this
			'direction': 'ascending',
		},
		...
	]
*/
Array.prototype.sortObjects = function(options) {
	// Make sure we are working with an array
	if(!Array.is(options)) {
		options = [options];
	}

	this.sort(function(a, b) {
        var sortedObjects = options.map(function(option) {
        	// Set the direction (ascending by default, may be specified to descending)
        	var direction = 1; // 1 = ascending, 2 = descending
        	if(option.direction) {
        		if(option.direction == 'descending') {
        			direction = -1;
        		}
        	}

        	var result = 0;

        	var aValue = a[option.key];
        	var bValue = b[option.key];

        	// Lowercase strings for comparisons
        	if(String.is(aValue)) {
        		aValue = aValue.lowercase();
        	}
        	if(String.is(bValue)) {
        		bValue = bValue.lowercase();
        	}

        	// Perform the comparison
            if(aValue > bValue) {
            	result = direction;
            }
            if(aValue < bValue) {
            	result = -(direction);
            }

            return result;
        })
        .reduce(function firstNonZeroValue(p, n) {
            return p ? p : n;
        }, 0);

        return sortedObjects;
    });

    return this;
};

Array.prototype.sortByLength = function(descending) {
	descending = (descending === undefined ? false : descending);

	this.sort(function(a, b) {
		if(descending) {
			return b.length - a.length;
		}
		else {
			return a.length - b.length;
		}
	});

	return this;
};

Array.prototype.isPrimitive = function() {
	return Array.isPrimitive(this);
};

Array.prototype.concatenate = Array.prototype.concat;

Array.prototype.merge = function() {
    // Gather the arrays to merge
    var arraysToMerge = [];
    for(var i = 0; i < arguments.length; i++) {
    	arraysToMerge.push(arguments[i]);
    };

    arraysToMerge.each(function(arrayToMergeIndex, arrayToMerge) {
    	arrayToMerge.each(function(arrayValueIndex, arrayValue) {
    		if(!this.contains(arrayValue)) {
    			this.push(arrayValue);
    		}
    	}.bind(this));
    }.bind(this));

    return this;
};

// Regular expression location can be:
// null (no regular expression will be used)
// 'search' (the search term is a regular expression)
// 'array' (the array itself contains regular expression(s) to be used to match against the search term)
// 'either' (both 'search' and 'array' methods above will be used to find a match)
Array.prototype.contains = function(search, caseSensitive, regularExpressionLocation) {
	caseSensitive = (caseSensitive === undefined ? false : caseSensitive); // case sensitive is off by default
	var contains = 0;

	// If search is nothing
	if(!search) {
		// Do nothing
	}
	// If not using a regular expression and not case sensitive
	else if(!regularExpressionLocation && !caseSensitive) {
		for(var i = 0; i < this.length; i++) {
			if(String.is(this[i]) && search.toLowerCase() == this[i].toLowerCase()) {
				contains++;
			}
		}
	}
	// If using a regular expression
	else if(regularExpressionLocation) {
		var searchRegularExpression;
		var modifiers = '';
		if(!caseSensitive) {
			modifiers = 'i'; // Case insensitive
		}

		// If search is a regular expression, use it, otherwise create a regular expression
		if(regularExpressionLocation == 'search' || regularExpressionLocation == 'either') {
			if(RegularExpression.is(search)) {
				searchRegularExpression = search;
			}
			else {
				searchRegularExpression = new RegularExpression('^'+search+'$', modifiers);
			}
		}

		// Loop through the array
		for(var i = 0; i < this.length; i++) {
			// Conditionally perform the search regular expression match
			if(regularExpressionLocation == 'search' || regularExpressionLocation == 'either') {
				// Perform the match check
				if(String.is(this[i]) && this[i].match(searchRegularExpression)) {
					//Console.log(this[i], 'MATCHED against the regular expression', searchRegularExpression.source);
					contains++;
				}
				else {
					//Console.log(this[i], 'DID NOT MATCH against the regular expression', searchRegularExpression.source);
				}
			}

			// Conditionally perform the array regular expression match
			if(regularExpressionLocation == 'array' || regularExpressionLocation == 'either') {
				// If the current array item is a regular expression, use it, otherwise create a regular expression
				var arrayRegularExpression;
				if(RegularExpression.is(this[i])) {
					arrayRegularExpression = this[i];
				}
				else {
					arrayRegularExpression = new RegularExpression('^'+this[i]+'$', modifiers);
				}

				// Perform the match check
				if(String.is(search) && search.match(arrayRegularExpression)) {
					//Console.log(search, 'MATCHED against the regular expression', arrayRegularExpression.source);
					contains++;
				}
				else {
					//Console.log(search, 'DID NOT MATCH against the regular expression', arrayRegularExpression.source);
				}
			}
		}
	}
	// If case sensitive and no regular expression
	else {
		this.each(function(index, value) {
			if(value == search) {
				contains++;
			}
		});
	}

	return contains;
};

Array.prototype.count = Array.prototype.contains;

Array.prototype.nth = function(index) {
	var item = null;

	if(this[index] !== undefined) {
		item = this[index];
	}

	return item;
};

Array.prototype.first = function() {
	return this.nth(0);
};

Array.prototype.second = function() {
	return this.nth(1);
};

Array.prototype.third = function() {
	return this.nth(2);
};

Array.prototype.fourth = function() {
	return this.nth(3);
};

Array.prototype.fifth = function() {
	return this.nth(4);
};

Array.prototype.sixth = function() {
	return this.nth(5);
};

Array.prototype.seventh = function() {
	return this.nth(6);
};

Array.prototype.eighth = function() {
	return this.nth(7);
};

Array.prototype.ninth = function() {
	return this.nth(8);
};

Array.prototype.tenth = function() {
	return this.nth(9);
};

Array.prototype.last = function() {
	var last = null;

	if(this[this.length - 1] !== undefined) {
		last = this[this.length - 1];
	}

	return last;
};

Array.prototype.secondToLast = function() {
	var secondToLast = null;

	if(this[this.length - 2] !== undefined) {
		secondToLast = this[this.length - 2];
	}

	return secondToLast;
};

Array.prototype.thirdToLast = function() {
	var thirdToLast = null;

	if(this[this.length - 3] !== undefined) {
		thirdToLast = this[this.length - 3];
	}

	return thirdToLast;
};

Array.prototype.get = function(index) {
	if(this[index]) {
		return this[index];
	}
	else {
		return null;
	}
};

Array.prototype.getObjectWithKeyValue = function(key, value) {
	var object = null;

	this.each(function(index, element) {
		if(Object.is(element)) {
			if(element[key] !== undefined && element[key] == value) {
				object = element;
				return false; // Break out of the loop
			}
		}
	});

	return object;
};

Array.prototype.getObjectsWithKeyValue = function(key, value) {
	var objects = [];

	this.each(function(index, element) {
		if(Object.is(element)) {
			if(element[key] !== undefined && element[key] == value) {
				objects.push(element);
			}
		}
	});

	return objects;
};

Array.prototype.deleteValue = function(value) {
	var valueIndex = this.indexOf(value);

	if(valueIndex > -1) {
		this.delete(valueIndex);
	}

	return this;
};

Array.prototype.delete = function(index) {
	this.splice(index, 1);

	return this;
};

Array.prototype.random = function() {
	return this[Number.random(0, this.length - 1)];
};

// Takes either a normal callback function or an async callback function
Array.prototype.each = function(callback) {
	var context = this;
	var callbackReturnValueForFirstItem = null;

	// Start out with a standard for loop
	for(var i = 0; i < this.length; i++) {
		var advance = callback.apply(context, [i, this[i], this]);

		// If the callback on the first item returns a Promise, break
		if(i == 0 && Promise.is(advance)) {
			callbackReturnValueForFirstItem = advance;
			break;
		}

		// If the callback returns false, break out of the for loop
		if(advance === false) {
			break;
		}
	}

	// If the callback for the first item returned a Promise
	if(callbackReturnValueForFirstItem) {
		// Keep track of the array
		var array = this;

		// This top level promise resolves after all array elements have been looped over
	    return new Promise(async function(resolve) {
	    	// Wait for the first item's Promise to resolve
	    	await callbackReturnValueForFirstItem;

    		// Use a for loop here instead of .each so I can use await below
    		// Start the loop on the second item
	    	for(var i = 1; i < array.length; i++) {
	    		// Await on a sub promise which resolves when the async callback for the current array element completes
	   			var advance = await new Promise(async function(subResolve) {
	   				// Run the async callback for the current array element, resolve the sub promise when complete
					var callbackReturnValue = await callback.apply(context, [i, array[i], array]);
					subResolve(callbackReturnValue);
				});

				// If the callback returns false, break out of the for loop
				if(advance === false) {
					break;
				}
	    	}

	    	resolve();
	    });
	}
};

Array.prototype.append = Array.prototype.push;

Array.prototype.prepend = Array.prototype.unshift;

Array.prototype.toString = Object.prototype.toString;

Array.prototype.toObject = function() {
	return Array.toObject(this);
};

// Static methods

Array.is = function(value) {
	return Object.prototype.toString.call(value) == '[object Array]';
};

Array.wrap = function(value) {
	if(!Array.is(value)) {
		value = [
			value,
		];
	}

	return value;
};

Array.isPrimitive = function(array) {
	var isPrimitive = true;

	array.each(function(index, element) {
		if(!Primitive.is(element)) {
			isPrimitive = false;
			return false; // break out of the .each
		}
	});

	return isPrimitive;
};

Array.clone = function(array) {
	return array.slice(0);
};

Array.unique = function(array) {
	var uniqueArray = [];

	array.each(function(index, element) {
		if(uniqueArray.indexOf(element) == -1) {
			uniqueArray.push(element);
		}
	});

	return uniqueArray;
};

Array.fromObject = function(object) {
	var array = [];

	object.each(function(key, value) {
		array.append(value);
	});

	return array;
};

Array.toObject = function(array) {
	var object = {};

	for(var i = 0; i < array.length; i++) {
		object[i] = array[i];
	}

	return object;
};
