RegularExpression = RegExp;

RegularExpression.is = function(value) {
	return value instanceof RegExp;
}

RegularExpression.escape = function(string) {
	if(Number.is(string)) {
		string = ''+string;
	}

	return string.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}