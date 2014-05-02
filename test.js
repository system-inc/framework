/*
Run this test using:
./node.0.11.12 --harmony test.js

In order to write async methods inline without callbacks, you need to wrap
them in a promise and put them inside of a generator with the yield keyword
in front of them.

Then, you need a special function that initiates the generator and calls
generator.next() until it hits a yielded promise. As soon as it hits a promise
it stops calling generator.next() and instead attaches a callback with the .done()
method of the promise that will call generator.next() when the callback is
complete. This works beautifully and with Bluebird as your promise library
it is very performant.

My problem - I want the special function to return after all of the promises
have been fulfilled. Specifically, I want the special function to return
the last value from the generator. It currently can't do this because it
has to call generator.next() from inside of the promises callback.

Ideas:

What if I put another special function in front of my other special function
and turn my other special function into a promise?
*/

Promise = require('./framework/node_modules/bluebird');

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

		// Keep track of our current value
		var value = (next === undefined) ? null : next.value;

		// Move to the next yield or return
		next = generator.next(value); // Pass the value into the generator so it can be assigned
		console.log('Function.run.pump next:', next);

		// Handle promises by not calling generator.next() until the promise resolves
		if(next.value instanceof Promise) {
			console.log('We have a promise we need to wait for!');
			next.value.done(function(value) {
				console.log('The promise has fulfilled its duty to mankind. It returned:', value);
				
				// Set next.value to the value from the finished promise
				next.value = value;

				// Tell the generator to move forward
				pump(generator, next);
			});
		}
		// If we don't have a promise, keep moving the generator forward
		else {
			return pump(generator, next);	
		}
	}

	return pump(generator);
}

console.log("\n\n\n*Starting\n---")
// And here we go
var result = Function.run(function*(variable) {
	var a = yield 1;
	var b = yield new Promise(function(resolve) {
		resolve(2);
	});
	var c = variable;
	console.log('variable:', variable);
	var d = a + b + c;

	return d;
}(3));
console.log('---');
console.log('result:', result);
console.log('        ^ should be 6, not undefined');
console.log("---\n*Finished\n\n\n")


