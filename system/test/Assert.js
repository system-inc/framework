// Dependencies
import EventEmitter from 'framework/system/event/EventEmitter.js';

// Class
class Assert extends Node.Assert {

	static eventEmitter = new EventEmitter();

	static fail(actual, expected, message, operator, startingStackFunction) {
		//console.log('actual', actual, 'expected', expected, 'message', message, 'operator', operator, 'startingStackFunction', startingStackFunction);
		var failMessage = message+' '+actual+' '+operator+' '+expected;

		return Node.Assert.fail(failMessage);
	}

	static true(value, message) {
		try {
			if(!value) {
				Assert.fail(value, 'truthy', message, '==');
			}

			Assert.eventEmitter.emit('Assert.finished', {
				status: 'passed',
				assertion: 'true',
				message: message,
			});
		}
		catch(error) {
			Assert.eventEmitter.emit('Assert.finished', {
				status: 'failed',
				assertion: 'true',
				message: message,
				error: error,
			});

			throw error;
		}
	}

	static false(value, message) {
		try {
			if(value) {
				Assert.fail(value, 'falsey', message, '==');
			}

			Assert.eventEmitter.emit('Assert.finished', {
				status: 'passed',
				assertion: 'false',
				message: message,
			});
		}
		catch(error) {
			Assert.eventEmitter.emit('Assert.finished', {
				status: 'failed',
				assertion: 'false',
				message: message,
				error: error,
			});

			throw error;
		}
	}

	static equal(actual, expected, message) {
		try {
			if(actual != expected) {
				Assert.fail(actual, expected, message, '==');
			}
			
			Assert.eventEmitter.emit('Assert.finished', {
				status: 'passed',
				assertion: 'equal',
				message: message,
			});
		}
		catch(error) {
			Assert.eventEmitter.emit('Assert.finished', {
				status: 'failed',
				assertion: 'equal',
				message: message,
				error: error,
			});

			throw error;
		}
	}

	static notEqual(actual, expected, message) {
		try {
			if(actual == expected) {
				Assert.fail(actual, expected, message, '!=');
			}
			
			Assert.eventEmitter.emit('Assert.finished', {
				status: 'passed',
				assertion: 'notEqual',
				message: message,
			});
		}
		catch(error) {
			Assert.eventEmitter.emit('Assert.finished', {
				status: 'failed',
				assertion: 'notEqual',
				message: message,
				error: error,
			});

			throw error;
		}
	}

	static isDeepEqual(actual, expected) {
		// All identical values are equivalent, as determined by ===.
		if(actual === expected) {
			return true;
		}
		else if(Node.Utility.isBuffer(actual) && Node.Utility.isBuffer(expected)) {
			if(actual.length != expected.length) {
				return false;
			}

			for(var i = 0; i < actual.length; i++) {
				if(actual[i] !== expected[i]) {
					return false;
				}
			}

			return true;
		// If the expected value is a Date object, the actual value is
		// equivalent if it is also a Date object that refers to the same time.
		}
		else if(Node.Utility.isDate(actual) && Node.Utility.isDate(expected)) {
			return actual.getTime() === expected.getTime();
		// If the expected value is a RegExp object, the actual value is
		// equivalent if it is also a RegExp object with the same source and
		// properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
		}
		else if(Node.Utility.isRegExp(actual) && Node.Utility.isRegExp(expected)) {
			return
				actual.source === expected.source &&
				actual.global === expected.global &&
				actual.multiline === expected.multiline &&
				actual.lastIndex === expected.lastIndex &&
				actual.ignoreCase === expected.ignoreCase;
		// Other pairs that do not both pass typeof value == 'object',
		// equivalence is determined by ==.
		}
		else if (!Node.Utility.isObject(actual) && !Node.Utility.isObject(expected)) {
			return actual == expected;
		// For all other Object pairs, including Array objects, equivalence is
		// determined by having the same number of owned properties (as verified
		// with Object.prototype.hasOwnProperty.call), the same set of keys
		// (although not necessarily the same order), equivalent values for every
		// corresponding key, and an identical 'prototype' property. Note: this
		// accounts for both named and indexed properties on Arrays.
		}
		else {
			return Assert.isEquivalentObject(actual, expected);
		}
	}

	static isEquivalentObject(a, b) {
		if(Node.Utility.isNullOrUndefined(a) || Node.Utility.isNullOrUndefined(b)) {
			return false;
		}
		// an identical 'prototype' property.
		if(a.prototype !== b.prototype) {
			return false;
		}
		// I've managed to break Object.keys through screwy arguments passing.
		// Converting to array solves the problem.
		var aIsArgs = Assert.isArguments(a);
		var bIsArgs = Assert.isArguments(b);
		if((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs)) {
			return false;	
		}
		if(aIsArgs) {
			a = pSlice.call(a);
			b = pSlice.call(b);
			return Assert.isDeepEqual(a, b);
		}

		try {
			var ka = Object.keys(a);
			var kb = Object.keys(b);
			var key;
			var i;
		}
		// Happens when one is a string literal and the other isn't
		catch(error) {
			return false;
		}

		// Having the same number of owned properties (keys incorporates hasOwnProperty)
		if(ka.length != kb.length) {
			return false;	
		}
		
		// The same set of keys (although not necessarily the same order)
		ka.sort();
		kb.sort();

		// Cheap key test
		for(i = ka.length - 1; i >= 0; i--) {
			if(ka[i] != kb[i]) {
				return false;
			}
		}

		// Equivalent values for every corresponding key, and possibly expensive deep test
		for(i = ka.length - 1; i >= 0; i--) {
			key = ka[i];
			if(!Assert.isDeepEqual(a[key], b[key])) {
				return false;
			}
		}

		return true;
	}

	static isArguments(object) {
		return Object.prototype.toString.call(object) == '[object Arguments]';
	}

	static deepEqual(actual, expected, message) {
		try {
			if(!Assert.isDeepEqual(actual, expected)) {
				Assert.fail(actual, expected, message, 'deepEqual');
			}
			
			Assert.eventEmitter.emit('Assert.finished', {
				status: 'passed',
				assertion: 'deepEqual',
				message: message,
			});
		}
		catch(error) {
			Assert.eventEmitter.emit('Assert.finished', {
				status: 'failed',
				assertion: 'deepEqual',
				message: message,
				error: error,
			});

			throw error;
		}
	}

	static notDeepEqual(actual, expected, message) {
		try {
			if(Assert.isDeepEqual(actual, expected)) {
				Assert.fail(actual, expected, message, 'notDeepEqual');
			}
			
			Assert.eventEmitter.emit('Assert.finished', {
				status: 'passed',
				assertion: 'notDeepEqual',
				message: message,
			});
		}
		catch(error) {
			Assert.eventEmitter.emit('Assert.finished', {
				status: 'failed',
				assertion: 'notDeepEqual',
				message: message,
				error: error,
			});

			throw error;
		}
	}

	static strictEqual(actual, expected, message) {
		try {
			if(actual !== expected) {
				Assert.fail(actual, expected, message, '===');
			}
			
			Assert.eventEmitter.emit('Assert.finished', {
				status: 'passed',
				assertion: 'strictEqual',
				message: message,
			});
		}
		catch(error) {
			Assert.eventEmitter.emit('Assert.finished', {
				status: 'failed',
				assertion: 'strictEqual',
				message: message,
				error: error,
			});

			throw error;
		}
	}

	static notStrictEqual(actual, expected, message) {
		try {
			if(actual === expected) {
				Assert.fail(actual, expected, message, '!==');
			}
			
			Assert.eventEmitter.emit('Assert.finished', {
				status: 'passed',
				assertion: 'notStrictEqual',
				message: message,
			});
		}
		catch(error) {
			Assert.eventEmitter.emit('Assert.finished', {
				status: 'failed',
				assertion: 'notStrictEqual',
				message: message,
				error: error,
			});

			throw error;
		}
	}

	static greaterThan(actual, minimum, message) {
		try {
			if(actual <= minimum) {
				Assert.fail(actual, minimum, message, '>');
			}
			
			Assert.eventEmitter.emit('Assert.finished', {
				status: 'passed',
				assertion: 'greaterThan',
				message: message,
			});
		}
		catch(error) {
			Assert.eventEmitter.emit('Assert.finished', {
				status: 'failed',
				assertion: 'greaterThan',
				message: message,
				error: error,
			});

			throw error;
		}
	}

	static greaterThanOrEqualTo(actual, minimum, message) {
		try {
			if(actual < minimum) {
				Assert.fail(actual, minimum, message, '>=');
			}
			
			Assert.eventEmitter.emit('Assert.finished', {
				status: 'passed',
				assertion: 'greaterThanOrEqualTo',
				message: message,
			});
		}
		catch(error) {
			Assert.eventEmitter.emit('Assert.finished', {
				status: 'failed',
				assertion: 'greaterThanOrEqualTo',
				message: message,
				error: error,
			});

			throw error;
		}
	}

	static lessThan(actual, maximum, message) {
		try {
			if(actual >= maximum) {
				Assert.fail(actual, maximum, message, '<');
			}
			
			Assert.eventEmitter.emit('Assert.finished', {
				status: 'passed',
				assertion: 'lessThan',
				message: message,
			});
		}
		catch(error) {
			Assert.eventEmitter.emit('Assert.finished', {
				status: 'failed',
				assertion: 'lessThan',
				message: message,
				error: error,
			});

			throw error;
		}
	}

	static lessThanOrEqualTo(actual, maximum, message) {
		try {
			if(actual > maximum) {
				Assert.fail(actual, maximum, message, '<=');
			}
			
			Assert.eventEmitter.emit('Assert.finished', {
				status: 'passed',
				assertion: 'lessThanOrEqualTo',
				message: message,
			});
		}
		catch(error) {
			Assert.eventEmitter.emit('Assert.finished', {
				status: 'failed',
				assertion: 'lessThanOrEqualTo',
				message: message,
				error: error,
			});

			throw error;
		}
	}

	static doesThrow(shouldThrow, block, expected, message) {
		var actual;

		if(Node.Utility.isString(expected)) {
			message = expected;
			expected = null;
		}

		try {
			block();
		}
		catch(error) {
			actual = error;
		}

		message = (expected && expected.name ? ' (' + expected.name + ').' : '.') + (message ? ' ' + message : '.');

		if(shouldThrow && !actual) {
			Assert.fail(actual, expected, 'Missing expected exception' + message);
		}

		if(!shouldThrow && Assert.expectedError(actual, expected)) {
			Assert.fail(actual, expected, 'Got unwanted exception' + message);
		}

		if((shouldThrow && actual && expected && !Assert.expectedError(actual, expected)) || (!shouldThrow && actual)) {
			throw actual;
		}
	}

	static expectedError(actual, expected) {
		var expectedError = false;

		if(!actual || !expected) {
			expectedError = false;
		}
		else {
			if(actual instanceof expected) {
				expectedError = true;
			}
			else {
				//console.log('error types do not match');
				//console.log('actual', actual);
				//console.log('expected', expected);
			}
		}
		
		return expectedError;
	}

	static throws(block, error, message) {
		try {
			Assert.doesThrow.apply(this, [true].concat(Array.prototype.slice.call(arguments)));
			
			Assert.eventEmitter.emit('Assert.finished', {
				status: 'passed',
				assertion: 'throws',
				message: message,
			});
		}
		catch(error) {
			Assert.eventEmitter.emit('Assert.finished', {
				status: 'failed',
				assertion: 'throws',
				message: message,
				error: error,
			});

			throw error;
		}
	}

	static throwsAsynchronously(block, expectedError, message) {
		return Assert.doesThrowAsynchronously(true, block, expectedError, message, arguments);
	}

	static doesNotThrowAsynchronously(block, expectedError, message) {
		return Assert.doesThrowAsynchronously(false, block, expectedError, message, arguments);
	}

	static doesThrowAsynchronously(shouldThrow, block, expectedError, message) {
		//app.info('callee', callee);

		// Allow the user to not pass an expected Exception type
		if(String.is(expectedError)) {
			message = expectedError;
			expectedError = null;
		}

		var assertion = shouldThrow ? 'throwsAsynchronously' : 'doesNotThrowAsynchronously';

		return new Promise(async function(resolve, reject) {
			function finish(error) {
				try {
					//app.info(error);

					// Failure case - if we should not throw but there is an error
					if(!shouldThrow && error) {
						Assert.fail('Thrown error', 'should not throw', message, 'when');
					}
					// Failure case - if we should throw but there was no error
					else if(shouldThrow && !error) {
						Assert.fail('No thrown error', 'should throw', message, 'when');
					}
					// Failure case - if we should throw and got an error but the expected exception does not match
					else if(shouldThrow && error &&  expectedError && !Assert.expectedError(error, expectedError)) {
						Assert.fail('Thrown error', 'thrown error', message, 'does not match the expected');
					}
					// Success case
					else {
						Assert.eventEmitter.emit('Assert.finished', {
							status: 'passed',
							assertion: assertion,
							message: message,
						});

						resolve(true);
					}
				}
				catch(error) {
					// TODO: This isn't working
					app.warn('Stack traces aren\'t being captured correctly');
					//Error.captureStackTrace(error, callee);

					Assert.eventEmitter.emit('Assert.finished', {
						status: 'failed',
						assertion: assertion,
						message: message,
						error: error,
					});

					// TODO:
					app.error('Rejected errors here aren\'t bubbling up to the Proctor correctly, need to fix this');

					reject(error); // This isn't being caught by the proctor
				}
			}

			// Run the block
			try {
				await block();
				finish();
			}
			catch(error) {
				finish(error);
			}
		});
	}

	static doesNotThrow(block, message) {
		try {
			Assert.doesThrow.apply(this, [false].concat(Array.prototype.slice.call(arguments)));
			
			Assert.eventEmitter.emit('Assert.finished', {
				status: 'passed',
				assertion: 'doesNotThrow',
				message: message,
			});
		}
		catch(error) {
			Assert.eventEmitter.emit('Assert.finished', {
				status: 'failed',
				assertion: 'doesNotThrow',
				message: message,
				error: error,
			});

			throw error;
		}
	}

}

// Export
export default Assert;
