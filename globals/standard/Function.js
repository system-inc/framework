// Class
class Function extends global.Function {

	getParameters() {
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

	isGenerator() {
		return Function.isGenerator(this);
	}

	static isGenerator(fn) {
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

	static is(value) {
		return value instanceof Function;
	}

	static delay(milliseconds, callback) {
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

	static schedule(milliseconds, callback) {
		return setTimeout(callback, milliseconds);
	}

	static cancel(scheduledFunction) {
		return clearTimeout(scheduledFunction);
	}

	static recur(milliseconds, callback) {
		return setInterval(callback, milliseconds);
	}

	static stop(recurrence) {
		return clearInterval(recurrence);
	}

}

// Global
global.Function = Function;

// Export
export default Function;