Object.prototype.isObject = function() {
	return typeof this == 'object';
}

Object.prototype.isUndefined = function() {
	return typeof this == 'undefined';
}

Object.prototype.isNull = function() {
	return typeof this == 'object';
}

Object.prototype.isBoolean = function() {
	return typeof this == 'boolean';
}

Object.prototype.isNumber = function() {
	return typeof this == 'number';
}

Object.prototype.isString = function() {
	return typeof this == 'string';
}

Object.prototype.isFunction = function() {
	return typeof this == 'function';
}

Object.prototype.toStringStandard = Object.prototype.toString;

Object.prototype.toString = function() {
	var string = null;

	if(this.isObject()) {
		string = Json.encode(this);
	}
	else {
		string = this.toStringStandard();
	}

	return string;
}