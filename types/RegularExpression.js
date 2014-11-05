RegularExpression = RegExp;

RegularExpression.is = function(value) {
	return value instanceof RegExp;
}