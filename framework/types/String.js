String.prototype.contains = function(string, caseSensitive) {
	caseSensitive = caseSensitive === false ? false : true;
	var contains = false;

	if(!caseSensitive) {
		var regularExpression = new RegExp(string, 'i');
		contains = regularExpression.test(this);
	}
	else {
		contains = this.indexOf(string) != -1;
	}

	return contains;
}

String.prototype.toNumber = function() {
	return Number(this);
}