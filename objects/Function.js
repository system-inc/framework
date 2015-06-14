Function.is = function(value) {
	return value instanceof Function;
}

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
}

Function.prototype.isGenerator = function() {
	return Function.isGenerator(this);
}

Function.prototype.toPromise = function() {
	if(this.isGenerator()) {
		return Generator.toPromise(this);
	}
	else {
		throw new Error('Only generator functions can be turned into promises.');
	}
}

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
}

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
}

// Calling .bind() on a generator function does not return a generator
// This fixes it, inspired by https://www.npmjs.org/package/generator-bind
Function.prototype.standardBind = Function.prototype.bind;
Function.prototype.bind = function(context) {
	// Normal functions use the standard bind
	if(this.constructor.name !== 'GeneratorFunction') {
		return Function.prototype.standardBind.apply(this, arguments);
	}
	// Generator functions return a generator
	else {
		var functionToBind = this;
		return function*() {
			// Have the generator return a Promise that resolves when the generator finishes
			return Generator.toPromise(functionToBind).apply(context, arguments);
		}
	}
}