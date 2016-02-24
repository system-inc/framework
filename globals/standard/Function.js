// Instance methods

Function.prototype.getParameters = function() {
	var parameters;

	// We store parameters in a function for generator functions that are defined in a Class
	if(this.parameters !== undefined) {
		parameters = this.parameters;
	}
	// Use regular expressions to get parameter names from a function
	else {
		parameters = this.toString()
			.replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s))/mg,'')
			.match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1]
			.split(/,/);
	}

	return parameters;
};

// Static methods

Function.is = function(value) {
	return value instanceof Function;
};

Function.delay = function(milliseconds, callback) {
	return new Promise(function(resolve) {
		setTimeout(function() {
			if(callback != undefined && Function.is(callback)) {
				resolve(callback());
			}
			else {
				resolve(true);
			}
		}, milliseconds);
	});
};

// Export
module.exports = Function;