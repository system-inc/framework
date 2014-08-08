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

Array.prototype.contains = function(string, caseSensitive) {
	caseSensitive = caseSensitive === false ? false : true;
	var contains = false;

	if(!caseSensitive) {
		for(var key in this) {
			if(this[key].isString() && string.toLowerCase() == this[key].toLowerCase()) {
				contains = true;
				break;
			}
		}
	}
	else {
		contains = this.indexOf(string) != -1;
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