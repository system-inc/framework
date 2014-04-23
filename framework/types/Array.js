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

Array.prototype.first = function() {
	var first = null;

	if(this[0]) {
		first = this[0];
	}
	
	return first;
}

Array.prototype.last = function() {
	var last = null;

	if(this[this.length - 1]) {
		last = this[this.length - 1];
	}
	
	return last;
}

Array.prototype.each = Array.prototype.forEach;