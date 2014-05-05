Generator = function() {
};

Generator.run = function(generator, resolve) {
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
		//console.log('Function.run.pump next:', next);	

		// Handle promises by not calling generator.next() until the promise completes
		if(next.value instanceof Promise) {
			//console.log('We have a promise we need to wait for!');

			// Tell the promise to pump the generator what it is done
			next.value.done(function(value) {
				//console.log('The promise has fulfilled its duty to mankind. It returned:', value);
				
				// Set next.value to the value from the finished promise
				next.value = value;

				// Tell the generator to move forward
				pump(generator, next);
			});

			// Tell the promise to log any errors it catches
			next.value.catch(function(error) {
				console.log('Fatal Error:', error);
			});
		}
		// If we don't have a promise, keep moving the generator forward
		else {
			return pump(generator, next);
		}
	}

	return pump(generator);
}