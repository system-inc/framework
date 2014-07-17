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

Array.prototype.each = Array.prototype.forEach;

Array.prototype.toString = Object.prototype.toString;