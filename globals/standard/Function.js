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

Function.prototype.isGenerator = function() {
	return Function.isGenerator(this);
};

// Static methods

Function.isGenerator = function(fn) {
	if(!fn) {
		return false;
	}

	var isGenerator = false;

	// Faster method first
	if(fn.constructor.name === 'GeneratorFunction') {
		isGenerator = true;
	}
	// Slower method second
	else if(/^function\s*\*/.test(fn.toString())) {
		isGenerator = true;
	}

	return isGenerator;
};

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

Function.schedule = function(milliseconds, callback) {
	return setTimeout(callback, milliseconds);
};

Function.cancel = function(scheduledFunction) {
	return clearTimeout(scheduledFunction);
};

Function.recur = function(milliseconds, callback) {
	return setInterval(callback, milliseconds);
};

Function.stop = function(recurrence) {
	return clearInterval(recurrence);
};
