Function.prototype.isGenerator = function() {
	return /^function\s*\*/.test(this.toString());
}

Function.is = function(value) {
	return value instanceof Function;
}