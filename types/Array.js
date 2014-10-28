Array.is = function(value) {
	return Object.prototype.toStringStandard.call(value) == '[object Array]';
}

Array.prototype.merge = function() {
    // Gather the arrays to merge
    var arraysToMerge = [];
    for(var i = 0; i < arguments.length; i++) {
    	arraysToMerge.push(arguments[i]);
    };

    arraysToMerge.each(function(arrayToMerge) {
    	arrayToMerge.each(function(arrayValue) {
    		if(!this.contains(arrayValue)) {
    			this.push(arrayValue);
    		}
    	}, this);
    }, this);

    return this;
}

// Regular expression location can be:
// null (no regular expression will be used)
// 'search' (the search term is a regular expression)
// 'array' (the array itself contains regular expression(s) to be used to match against the search term)
// 'either' (both 'search' and 'array' methods above will be used to find a match)
Array.prototype.contains = function(search, caseSensitive, regularExpressionLocation) {
	caseSensitive = caseSensitive === false ? false : true;
	var contains = false;

	// If not using a regular expression and not case sensitive
	if(!regularExpressionLocation && !caseSensitive) {
		for(var i = 0; i < this.length; i++) {
			if(String.is(this[i]) && search.toLowerCase() == this[i].toLowerCase()) {
				contains = true;
				break;
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
			if(Object.isRegularExpression(search)) {
				searchRegularExpression = search;
			}
			else {
				searchRegularExpression = new RegExp('^'+search+'$', modifiers);
			}	
		}

		// Loop through the array
		for(var i = 0; i < this.length; i++) {
			// Conditionally perform the search regular expression match
			if(regularExpressionLocation == 'search' || regularExpressionLocation == 'either') {
				// Perform the match check
				if(String.is(this[i]) && this[i].match(searchRegularExpression)) {
					//Console.out(this[i], 'MATCHED against the regular expression', searchRegularExpression.source);
					contains = true;
					break;
				}
				else {
					//Console.out(this[i], 'DID NOT MATCH against the regular expression', searchRegularExpression.source);
				}
			}

			// Conditionally perform the array regular expression match
			if(regularExpressionLocation == 'array' || regularExpressionLocation == 'either') {
				// If the current array item is a regular expression, use it, otherwise create a regular expression
				var arrayRegularExpression;
				if(Object.isRegularExpression(this[i])) {
					arrayRegularExpression = this[i];
				}
				else {
					arrayRegularExpression = new RegExp('^'+this[i]+'$', modifiers);
				}

				// Perform the match check
				if(String.is(search) && search.match(arrayRegularExpression)) {
					//Console.out(search, 'MATCHED against the regular expression', arrayRegularExpression.source);
					contains = true;
					break;
				}
				else {
					//Console.out(search, 'DID NOT MATCH against the regular expression', arrayRegularExpression.source);
				}
			}
		}
	}
	// If case sensitive and no regular expression
	else {
		contains = this.indexOf(search) != -1;
	}

	return contains;
}

Array.prototype.first = function() {
	var first = null;

	if(this[0]) {
		first = this[0];
	}
	
	return first;
}

Array.prototype.last = function() {
	var last = null;

	if(this[this.length - 1]) {
		last = this[this.length - 1];
	}
	
	return last;
}

Array.prototype.get = function(index) {
	if(this[index]) {
		return this[index];
	}
	else {
		return null;
	}
}

Array.prototype.delete = function(index) {
	this.splice(index, 1);

	return this;
};

// Takes either a normal callback function or a generator callback function
Array.prototype.each = function(callback, context) {
	// If the callback is not a generator, use the standard .forEach
	if(!callback.isGenerator()) {
		Array.prototype.forEach.apply(this, arguments)
	}
	// If the callback is a generator, work some inception magic
	else {
		// Keep track of the array
		var array = this;

		// This top level promise resolves after all array elements have been looped over
	    return new Promise(function(resolve) {
	    	// Run an anonymous generator function which loops over each array element, allowing me to yield on a sub promise
	    	Generator.run(function*() {
	    		// Use a for loop here instead of .each so I can use yield below
		    	for(var i = 0; i < array.length; i++) {
		    		// Yield on a sub promise which resolves when the generator callback for the current array element completes
		   			yield new Promise(function(subResolve) {
		   				// Invoke and run the generator callback for the current array element, resolve the sub promise when complete
						Generator.run(callback.apply(context, [array[i]]), subResolve);
					});
		    	}
	    	}, resolve);
	    });
	}
}

Array.prototype.toString = Object.prototype.toString;