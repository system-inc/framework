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

RegularExpression.stringMatchesWildcardPattern = function(string, wildcardPattern) {
	// Make string "event1" match wildcard pattern "event1.*"
	if(wildcardPattern.endsWith('.*')) {
		wildcardPattern = wildcardPattern.replaceLast('.*', '*');
	}

	// Build the pattern
	var regularExpressionPattern = wildcardPattern.split('*').join('.*');
	regularExpressionPattern = "^" + regularExpressionPattern + "$"

	// Create the expression
	var regularExpression = new RegularExpression(regularExpressionPattern);

	// Return true or false
	return regularExpression.test(string);
};

// Export
module.exports = RegularExpression;