// Static methods

RegExp.is = function(value) {
	return value instanceof RegExp;
};

RegExp.equal = function(x, y) {
	return (x instanceof RegExp) && (y instanceof RegExp) &&
				 (x.source === y.source) && (x.global === y.global) &&
				 (x.ignoreCase === y.ignoreCase) && (x.multiline === y.multiline);
}

RegExp.escape = function(string) {
	if(Number.is(string)) {
		string = ''+string;
	}

	return string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

// Global
global.RegularExpression = RegExp;
