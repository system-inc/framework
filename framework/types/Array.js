Array.prototype.contains = function(string, caseSensitive) {
	caseSensitive = caseSensitive === false ? false : true;
	var contains = false;

	if(!caseSensitive) {
		for(var key in this) {
			if(string.toLowerCase() == this[key].toLowerCase()) {
				contains = true;
				break;
			}
		}
	}
	else {
		contains = this.indexOf(string) != -1;
	}

	return contains;
}