// Class
var RegularExpression = RegExp; // use RegExp

// Static methods

RegularExpression.is = function(value) {
	return value instanceof RegExp;
};

RegularExpression.equal = function(x, y) {
    return (x instanceof RegExp) && (y instanceof RegExp) && 
           (x.source === y.source) && (x.global === y.global) && 
           (x.ignoreCase === y.ignoreCase) && (x.multiline === y.multiline);
}

RegularExpression.escape = function(string) {
	if(Number.is(string)) {
		string = ''+string;
	}

	return string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
};

// Export
module.exports = RegularExpression;