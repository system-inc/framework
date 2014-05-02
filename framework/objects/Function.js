Function.prototype.isGenerator = function() {
	return /^function\s*\*/.test(this.toString());
}

Function.is = function(value) {
	return value instanceof Function;
}

Function.run = function(generator) {
	// Make sure we are working with an invoked generator
	if(generator instanceof Function) {
		generator = generator();
	}

	var pump = function(generator, next) {
		// Return next.value if we are finished
		if(next && next.done) {
			return next.value;
		}

		// Keep track of our value
		var value = (next === undefined) ? null : next.value;

		// Move to the next yield or return
		next = generator.next(value);
		console.log('Function.pump next:', next);

		// Handle promises
		if(next.value instanceof Promise) {
			console.log('we have a promise we need to wait for!');
			next.value.done(function(value) {
				console.log('(next.value = promise).done:', value);
				next.value = value;
				pump(generator, next);
			});
		}
		else {
			return pump(generator, next);	
		}
	}

	return pump(generator);
}