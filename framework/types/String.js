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

String.prototype.replaceStandard = String.prototype.replace;

String.prototype.replaceFirst = function(pattern, replacement) {
	return this.replaceStandard(pattern, replacement);
}

String.prototype.replace = function(pattern, replacement, flags) {
	// Use standard replace if they are sending in a regex pattern or flags
	if(pattern instanceof RegExp || flags) {
		return this.replaceStandard(pattern, replacement, flags);	
	}
	// Make replace behave like replaceAll by default
	else {
		return this.replaceStandard(new RegExp(pattern, 'g'), replacement);	
	}
}

String.prototype.toNumber = function() {
	return Number(this);
}