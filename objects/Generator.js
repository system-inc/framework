Generator = {};

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
		//Console.out('Function.run.pump next:', next);

		// Handle promises by not calling generator.next() until the promise completes
		if(next.value instanceof Promise) {
			//Console.out('We have a promise we need to wait for!');

			// This needs to be called before .done for reasons I don't fully understand when using Function.delay
			//next.value.catch(function(error) {
				// Log the error
				//Console.out('Caught error at Generator.js:', error);
				//throw(error);
				//reject(error);
				//resolve(error);
			//});

			// Tell the promise to pump the generator what it is done
			next.value.done(function(value) {
				// Set next.value to the value from the finished promise
				next.value = value;

				// Tell the generator to move forward
				pump(generator, next);
			});
		}
		//else if(next.value instanceof Error) {
		//	Console.out('we got an error!', next.value);
		//}
		// If we don't have a promise, keep moving the generator forward
		else {
			return pump(generator, next);
		}
	}

	return pump(generator);
}

Generator.toPromise = function(generatorFunction) {
	// Keep track of the original generator function parameters before we overwrite the generator function
	var originalGeneratorParameters = generatorFunction.getParameters();

	// Use a closure to generate a new, unique anonymous function which returns a promise which will resolve when the method completes execution
	return (function(generatorFunction) {
		var fn = function() {
			// Invoke the generator with the right context and arguments
			var invokedGeneratorFunction = generatorFunction.apply(this, arguments);

			var promise = new Promise(function(resolve, reject) {
				// Run the invoked generator
				Generator.run(invokedGeneratorFunction, resolve, reject);
			});

			// Return a promise
			return promise;
		};

		// You'll judge me for this in the future, but this is the only way I can store parameters for generator functions
		fn.parameters = originalGeneratorParameters;

		return fn;
	})(generatorFunction);
}