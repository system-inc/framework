Function.prototype.isGenerator = function() {
	return /^function\s*\*/.test(this.toString());
}

Function.prototype.getArguments = function() {
	return this.toString()
	  .replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s))/mg,'')
	  .match(/^function\s*[^\(]*\(\s*([^\)]*)\)/m)[1]
	  .split(/,/);
}

Function.is = function(value) {
	return value instanceof Function;
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