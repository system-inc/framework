// Instance methods

Array.prototype.append = Array.prototype.push;

Array.prototype.prepend = Array.prototype.unshift;

Array.prototype.toString = Object.prototype.toString;

Array.prototype.getSize = function() {
	return this.length;
};

Array.prototype.clone = function() {
	return Array.clone(this);
};

Array.prototype.unique = function() {
	return Array.unique(this);
};

Array.prototype.sortObjectsByKeyValue = function(key, direction = 'ascending') {
	// Ascending, smallest to largest (default)
	if(direction == 'ascending') {
		this.sort(function(a, b) {
			if(a[key] > b[key]) {
				return 1;
			}
			else if(a[key] < b[key]) {
				return -1;
			}
			else {
				return 0;
			}
		});
	}
	// Descending, largest to smallest
	else if(direction == 'descending') {
		this.sort(function(a, b) {
			if(a[key] < b[key]) {
				return 1;
			}
			else if(a[key] > b[key]) {
				return -1;
			}
			else {
				return 0;
			}
		});
	}

	return this;
};

// Options
/*
	[
		{
			'key': 'key', // sort by this first
			'direction': 'descending',
		},
		{
			'key': 'key', // then by this
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

Array.prototype.sortByLength = function(descending = false) {
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
    	arraysToMerge.append(arguments[i]);
    };

    arraysToMerge.each(function(arrayToMergeIndex, arrayToMerge) {
    	arrayToMerge.each(function(arrayValueIndex, arrayValue) {
    		if(!this.contains(arrayValue)) {
    			this.append(arrayValue);
    		}
    	}.bind(this));
    }.bind(this));

    return this;
};

Array.prototype.inherit = Array.prototype.merge;

// Regular expression location can be:
// null (no regular expression will be used)
// 'search' (the search term is a regular expression)
// 'array' (the array itself contains regular expression(s) to be used to match against the search term)
// 'either' (both 'search' and 'array' methods above will be used to find a match)
Array.prototype.contains = function(search, caseSensitive = false, regularExpressionLocation) {
	var contains = 0;

	// If search is nothing
	if(!search) {
		// Do nothing
	}
	// If not using a regular expression and not case sensitive
	else if(!regularExpressionLocation && !caseSensitive) {
		for(var i = 0; i < this.length; i++) {
			if(String.is(this[i]) && search.lowercase() == this[i].lowercase()) {
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
					//app.log(this[i], 'MATCHED against the regular expression', searchRegularExpression.source);
					contains++;
				}
				else {
					//app.log(this[i], 'DID NOT MATCH against the regular expression', searchRegularExpression.source);
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
					//app.log(search, 'MATCHED against the regular expression', arrayRegularExpression.source);
					contains++;
				}
				else {
					//app.log(search, 'DID NOT MATCH against the regular expression', arrayRegularExpression.source);
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
				objects.append(element);
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

Array.prototype.randomize = function() {
	var array = this;

	var currentIndex = array.length;
	var temporaryValue = null;
	var randomIndex = null;

	// While there remain elements to shuffle
	while (0 !== currentIndex) {
		// Pick a remaining element
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

// Takes either a normal callback function or an async callback function
// Similar to Object.prototype.each
Array.prototype.each = function(callback, direction = 'ascending') {
	var context = this;
	var promiseFromFirstItemCallback = null;

	// Start out with a standard for loop
	// Loop forward
	if(direction == 'ascending') {
		for(var i = 0; i < this.length; i++) {
			var advance = callback.apply(context, [i, this[i], this]);
	
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
	}
	// Loop backwards
	else if(direction == 'descending') {
		for(var i = this.length - 1; i >= 0; i--) {
			var advance = callback.apply(context, [i, this[i], this]);
	
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
	}

	// If the callback for the first item returned a Promise
	if(promiseFromFirstItemCallback) {
		// Keep track of the array
		var array = this;

		// This top level promise resolves after all array elements have been looped over
	    return new Promise(async function(resolve) {
	    	// Wait for the first item's Promise to resolve
	    	var resolvedValueFromPromiseFromFirstItemCallback = await promiseFromFirstItemCallback;

	    	// If the return value from the Promise from the first item is false, do not do anything
	    	if(resolvedValueFromPromiseFromFirstItemCallback === false) {
	    	}
	    	else {
				// Use a for loop here instead of .each so I can use await below
				// Loop forwards
				if(direction == 'ascending') {
					for(var i = 1; i < array.length; i++) { // Start the loop on the second item
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
				}
				// Loop backwards
				else if(direction == 'descending') {
					for(var i = array.length - 2; i >= 0; i--) { // Start the loop on the second item
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
				}
	    	}

	    	resolve();
	    });
	}
};

Array.prototype.toObject = function() {
	return Array.toObject(this);
};

Array.prototype.toConjunctionString = function(coordinatingConjunction, wrap = '') {
	var conjunctionString = wrap+this.join(wrap+', '+wrap);

	if(this.length > 2) {
		conjunctionString = conjunctionString.replaceLast(', ', ', '+coordinatingConjunction+' ');	
	}
	else {
		conjunctionString = conjunctionString.replaceLast(', ', ' '+coordinatingConjunction+' ');
	}

	return conjunctionString+wrap;
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
			uniqueArray.append(element);
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

Array.fromCsvString = function(csvString, delimiter = ',', returnRowsAsArrays = false) {        
	// Regular expression to parse the CSV values
	var pattern = new RegExp( 
		(
			// Delimiters
			"(\\"+delimiter+"|\\r?\\n|\\r|^)"+
			// Quoted fields
			"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|"+
			// Standard fields
			"([^\"\\"+delimiter+"\\r\\n]*))"
		), 'gi'
	);

	// Array for data, first row is column headers
	var rows = [[]];

	// Array to hold individual pattern matching groups
	var matches = false; // false if we don't find any matches
	
	// Loop until we no longer find a regular expression match
	while(matches = pattern.exec(csvString)) {
		var matchedDelimiter = matches[1]; // Get the matched delimiter
		// Check if the delimiter has a length (and is not the start of string) and if it matches field delimiter. If not, it is a row delimiter
		if(matchedDelimiter.length && matchedDelimiter !== delimiter) {
			// Since this is a new row of data, add an empty row to the array.
			rows.push([]);
		}
		var matchedValue;
		// Once we have eliminated the delimiter, check to see what kind of value was captured (quoted or unquoted):
		if(matches[2]) {
			// Found a quoted value, unescape any double quotes
			matchedValue = matches[2].replace(
				new RegExp( "\"\"", "g" ), "\""
			);
		}
		// Found a non-quoted value
		else {
			matchedValue = matches[3];
		}
		
		// Now that we have our value string, let's add it to the data array
		rows[rows.length - 1].push(matchedValue);
	}

	// If we want to return an array with rows as arrays
	if(returnRowsAsArrays) {
		return rows;
	}
	// If not, we will return an array with rows as objects
	else {
		let array = [];

        // The first row has the fields
		let fieldsArray = rows.shift();
		
		// Rename the fields to camel case
		fieldsArray.each(function(index, field) {
			fieldsArray[index] = field.toCamelCase();
		});

        rows.each(function(rowIndex, row) {
            // Create the new entry
            let entry = {};

            // Set the fields
            fieldsArray.each(function(fieldIndex, field) {
                entry[field] = row[fieldIndex];
            });

            array.push(entry);
        });

        return array;
	}
};
