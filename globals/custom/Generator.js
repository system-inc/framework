// Class
var Generator = {};

// Instance methods

Function.prototype.isGenerator = function() {
	return Function.isGenerator(this);
};

Function.prototype.toPromise = function() {
	if(this.isGenerator()) {
		return Generator.toPromise(this);
	}
	else {
		throw new Error('Only generator functions can be turned into promises.');

		//var argumentsToApply = arguments;
		//return new Promise(function(resolve, reject) {
		//	resolve(this.apply(this, argumentsToApply));
		//}.bind(this));
	}
};

Function.prototype.run = function() {
	var result = undefined;

	if(this.isGenerator()) {
		result = this.toPromise().apply(this, arguments);
	}
	else {
		result = this.apply(this, arguments);
	}

	return result;
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

Generator.is = Function.isGenerator;

Generator.run = function(generator, resolve, reject) {
	// Make sure we are working with an invoked generator
	if(generator instanceof Function) {
		generator = generator();
	}

	var pump = function(generator, next) {
		// Return next.value if we are finished
		if(next && next.done) {
			// If a promise resolver was passed in, use it to resolve the promise now
			if(resolve) {
				resolve(next.value);	
			}
			
			return next.value;
		}

		// Keep track of our current value
		var value = (next === undefined) ? null : next.value;

		// Move to the next yield or return
		next = generator.next(value); // Pass the value into the generator so it can be assigned
		//Console.log('Function.run.pump next:', next);

		// Handle promises by not calling generator.next() until the promise completes
		if(next.value instanceof Promise) {
			//Console.log('We have a promise we need to wait for!');

			// Catch errors from the promises
			//next.value.catch(function(error) {
				// And emit them to the current domain
				//Node.Process.domain.emit('error', error); // this does not work and causes race conditions because it is using the global domain whereas we need to use a reference to the correct domain
			//});

			// Tell the promise to pump the generator what it is done, done is a bluebird specific method
			next.value.done(function(value) {
				// Set next.value to the value from the finished promise
				next.value = value;

				// Tell the generator to move forward
				pump(generator, next);
			});

			// Return the value if it is a promise
			return next.value;
		}
		//else if(next.value instanceof Error) {
		//	Console.log('we got an error!', next.value);
		//}
		// If we don't have a promise, keep moving the generator forward
		else {
			return pump(generator, next);
		}
	};

	return pump(generator);
};

Generator.toPromise = function(generatorFunction) {
	// Keep track of the original generator function parameters before we overwrite the generator function
	var originalGeneratorParameters = generatorFunction.getParameters();

	// Use a closure to generate a new, unique anonymous function which returns a promise which will resolve when the method completes execution
	return (function(generatorFunction) {
		var promiseFunction = function() {
			// Invoke the generator with the right context and arguments
			var invokedGeneratorFunction = generatorFunction.apply(this, arguments);

			// Return a promise
			return new Promise(function(resolve, reject) {
				// Run the invoked generator
				Generator.run(invokedGeneratorFunction, resolve, reject);
			});
		};

		// You'll judge me for this in the future, but this is the only way I can store parameters for generator functions
		promiseFunction.parameters = originalGeneratorParameters;

		return promiseFunction;
	})(generatorFunction);
};

// Export
module.exports = Generator;