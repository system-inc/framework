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