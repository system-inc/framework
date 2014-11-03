Function.prototype.getArguments = function() {
	return this.toString()
	  .replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s))/mg,'')
	  .match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1]
	  .split(/,/);
}

Function.is = function(value) {
	return value instanceof Function;
}

Function.prototype.isGenerator = function() {
	return Function.isGenerator(this);
}

Function.isGenerator = function(fn) {
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