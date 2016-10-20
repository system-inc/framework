// Instance methods

Object.defineProperty(Function.prototype, 'getParameters', {
	enumerable: false,
	value: function() {
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
	},
});

Object.defineProperty(Function.prototype, 'isAsync', {
	enumerable: false,
	value: function() {
		return Function.isAsync(this);
	},
});

// Static methods

Object.defineProperty(Function, 'isAsync', {
	enumerable: false,
	value: function(fn) {
		var isAsync = false;

		// Is it an actual ES7 async function? (as of Nov-2015, no JS-runtime supports this yet)
		// https://tc39.github.io/ecmascript-asyncawait/#async-function-constructor-properties
		if(fn && fn.constructor && fn.constructor.name === 'AsyncFunction') {
			isAsync = true;
		}

		return isAsync;
	},
});

Object.defineProperty(Function, 'is', {
	enumerable: false,
	value: function(value) {
		return value instanceof Function;
	},
});

Object.defineProperty(Function, 'delay', {
	enumerable: false,
	value: function(milliseconds, callback) {
		return new Promise(function(resolve) {
			setTimeout(function() {
				if(Function.is(callback)) {
					resolve(callback());
				}
				else {
					resolve(true);
				}
			}, milliseconds);
		});
	},
});

Object.defineProperty(Function, 'schedule', {
	enumerable: false,
	value: function(milliseconds, callback) {
		return setTimeout(callback, milliseconds);
	},
});

Object.defineProperty(Function, 'cancel', {
	enumerable: false,
	value: function(scheduledFunction) {
		return clearTimeout(scheduledFunction);
	},
});

Object.defineProperty(Function, 'recur', {
	enumerable: false,
	value: function(milliseconds, callback) {
		return setInterval(callback, milliseconds);
	},
});

Object.defineProperty(Function, 'stop', {
	enumerable: false,
	value: function(recurrence) {
		return clearInterval(recurrence);
	},
});
