Object.prototype.sort = function() {
	var sorted = {};

	Object.keys(this).sort().each(function(key) {
		sorted[key] = this[key];
	}, this);

	return sorted;
}

Object.prototype.each = function(callback, context) {
	var self = this;
	Object.keys(this).each(function(key) {
		callback.apply(context, [key, self[key]]);
	});
}

Object.prototype.merge = function() {
    var objectsToMerge = [];

    // Gather the objects to merge
    for(var i = 0; i < arguments.length; i++) {
    	objectsToMerge.push(arguments[i]);
    };

    // "this" merges any properties from the objects to merge that it does not already have
    objectsToMerge.each(function(objectToMerge) {
    	for(var property in objectToMerge) {
    		if(this[property] === undefined) {
    			this[property] = objectToMerge[property];
    		}
    	}
    }, this);

    return this;
}

Object.prototype.isObject = function() {
	return typeof this == 'object';
}

Object.is = function(value) {
	return typeof value == 'object';
}

Object.prototype.isClass = function() {
	return Class && this instanceof Class;
}

Object.prototype.isBoolean = function() {
	return this instanceof Boolean;
}

Object.prototype.isNumber = function() {
	return this instanceof Number;
}

Object.prototype.isInteger = function() {
	return /^\+?(0|[1-9]\d*)$/.test(this);
}

Object.prototype.isString = function() {
	return this instanceof String;
}

Object.prototype.isFunction = function() {
	return this instanceof Function;
}

Object.prototype.toStringStandard = Object.prototype.toString;

Object.prototype.toString = function() {
	var string = null;

	// Debugging
	return string = this.toStringStandard();

	if(this.isObject()) {
		string = Json.encode(this);
	}
	else {
		string = this.toStringStandard();
	}

	return string;
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