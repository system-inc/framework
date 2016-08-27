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

Function.prototype.isAsync = function() {
	return Function.isAsync(this);
};

// Static methods

Function.isAsync = function(fn) {
	var isAsync = false;

	// Is it an actual ES7 async function? (as of Nov-2015, no JS-runtime supports this yet)
	// https://tc39.github.io/ecmascript-asyncawait/#async-function-constructor-properties
	if(fn && fn.constructor && fn.constructor.name === 'AsyncFunction') {
		isAsync = true;
	}

	return isAsync;
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
