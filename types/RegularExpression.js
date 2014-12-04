RegularExpression = RegExp;

RegularExpression.is = function(value) {
	return value instanceof RegExp;
}

RegularExpression.escape = function(string) {
	return string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}