// Class
var Assert = Node.Assert = Node.require('assert');

// Static methods

Assert.true = function(value, message) {
	try {
		if(!value) {
			Assert.fail(value, 'truthy', message, '==');
		}

		Framework.emit('Assert.finished', {
			status: 'passed',
			assertion: 'true',
			message: message,
		});
	}
	catch(error) {
		Error.captureStackTrace(error, arguments.callee);

		Framework.emit('Assert.finished', {
			status: 'failed',
			assertion: 'true',
			message: message,
			error: error,
		});

		throw error;
	}
};

Assert.false = function(value, message) {
	try {
		if(value) {
			Assert.fail(value, 'falsey', message, '==');
		}

		Framework.emit('Assert.finished', {
			status: 'passed',
			assertion: 'false',
			message: message,
		});
	}
	catch(error) {
		Error.captureStackTrace(error, arguments.callee);

		Framework.emit('Assert.finished', {
			status: 'failed',
			assertion: 'false',
			message: message,
			error: error,
		});

		throw error;
	}
};

Assert.equal = function(actual, expected, message) {
	try {
		if(actual != expected) {
			Assert.fail(actual, expected, message, '==');
		}
		
		Framework.emit('Assert.finished', {
			status: 'passed',
			assertion: 'equal',
			message: message,
		});
	}
	catch(error) {
		Error.captureStackTrace(error, arguments.callee);

		Framework.emit('Assert.finished', {
			status: 'failed',
			assertion: 'equal',
			message: message,
			error: error,
		});

		throw error;
	}
};

Assert.notEqual = function(actual, expected, message) {
	try {
		if(actual == expected) {
			Assert.fail(actual, expected, message, '!=');
		}
		
		Framework.emit('Assert.finished', {
			status: 'passed',
			assertion: 'notEqual',
			message: message,
		});
	}
	catch(error) {
		Error.captureStackTrace(error, arguments.callee);

		Framework.emit('Assert.finished', {
			status: 'failed',
			assertion: 'notEqual',
			message: message,
			error: error,
		});

		throw error;
	}
};

Assert.isDeepEqual = function(actual, expected) {
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
};

Assert.isEquivalentObject = function(a, b) {
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
};

Assert.isArguments = function(object) {
	return Object.prototype.toString.call(object) == '[object Arguments]';
};

Assert.deepEqual = function(actual, expected, message) {
	try {
		if(!Assert.isDeepEqual(actual, expected)) {
			Assert.fail(actual, expected, message, 'deepEqual');
		}
		
		Framework.emit('Assert.finished', {
			status: 'passed',
			assertion: 'deepEqual',
			message: message,
		});
	}
	catch(error) {
		Error.captureStackTrace(error, arguments.callee);

		Framework.emit('Assert.finished', {
			status: 'failed',
			assertion: 'deepEqual',
			message: message,
			error: error,
		});

		throw error;
	}
};

Assert.notDeepEqual = function(actual, expected, message) {
	try {
		if(Assert.isDeepEqual(actual, expected)) {
			Assert.fail(actual, expected, message, 'notDeepEqual');
		}
		
		Framework.emit('Assert.finished', {
			status: 'passed',
			assertion: 'notDeepEqual',
			message: message,
		});
	}
	catch(error) {
		Error.captureStackTrace(error, arguments.callee);

		Framework.emit('Assert.finished', {
			status: 'failed',
			assertion: 'notDeepEqual',
			message: message,
			error: error,
		});

		throw error;
	}
};

Assert.strictEqual = function(actual, expected, message) {
	try {
		if(actual !== expected) {
			Assert.fail(actual, expected, message, '===');
		}
		
		Framework.emit('Assert.finished', {
			status: 'passed',
			assertion: 'strictEqual',
			message: message,
		});
	}
	catch(error) {
		Error.captureStackTrace(error, arguments.callee);

		Framework.emit('Assert.finished', {
			status: 'failed',
			assertion: 'strictEqual',
			message: message,
			error: error,
		});

		throw error;
	}
};

Assert.notStrictEqual = function(actual, expected, message) {
	try {
		if(actual === expected) {
			Assert.fail(actual, expected, message, '!==');
		}
		
		Framework.emit('Assert.finished', {
			status: 'passed',
			assertion: 'notStrictEqual',
			message: message,
		});
	}
	catch(error) {
		Error.captureStackTrace(error, arguments.callee);

		Framework.emit('Assert.finished', {
			status: 'failed',
			assertion: 'notStrictEqual',
			message: message,
			error: error,
		});

		throw error;
	}
};

Assert.greaterThan = function(actual, minimum, message) {
	try {
		if(actual <= minimum) {
			Assert.fail(actual, minimum, message, '>');
		}
		
		Framework.emit('Assert.finished', {
			status: 'passed',
			assertion: 'greaterThan',
			message: message,
		});
	}
	catch(error) {
		Error.captureStackTrace(error, arguments.callee);

		Framework.emit('Assert.finished', {
			status: 'failed',
			assertion: 'greaterThan',
			message: message,
			error: error,
		});

		throw error;
	}
};

Assert.greaterThanOrEqualTo = function(actual, minimum, message) {
	try {
		if(actual < minimum) {
			Assert.fail(actual, minimum, message, '>=');
		}
		
		Framework.emit('Assert.finished', {
			status: 'passed',
			assertion: 'greaterThanOrEqualTo',
			message: message,
		});
	}
	catch(error) {
		Error.captureStackTrace(error, arguments.callee);

		Framework.emit('Assert.finished', {
			status: 'failed',
			assertion: 'greaterThanOrEqualTo',
			message: message,
			error: error,
		});

		throw error;
	}
};

Assert.lessThan = function(actual, maximum, message) {
	try {
		if(actual >= maximum) {
			Assert.fail(actual, maximum, message, '<');
		}
		
		Framework.emit('Assert.finished', {
			status: 'passed',
			assertion: 'lessThan',
			message: message,
		});
	}
	catch(error) {
		Error.captureStackTrace(error, arguments.callee);

		Framework.emit('Assert.finished', {
			status: 'failed',
			assertion: 'lessThan',
			message: message,
			error: error,
		});

		throw error;
	}
};

Assert.lessThanOrEqualTo = function(actual, maximum, message) {
	try {
		if(actual > maximum) {
			Assert.fail(actual, maximum, message, '<=');
		}
		
		Framework.emit('Assert.finished', {
			status: 'passed',
			assertion: 'lessThanOrEqualTo',
			message: message,
		});
	}
	catch(error) {
		Error.captureStackTrace(error, arguments.callee);

		Framework.emit('Assert.finished', {
			status: 'failed',
			assertion: 'lessThanOrEqualTo',
			message: message,
			error: error,
		});

		throw error;
	}
};

Assert.doesThrow = function(shouldThrow, block, expected, message) {
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

	if(!shouldThrow && Assert.expectedException(actual, expected)) {
		Assert.fail(actual, expected, 'Got unwanted exception' + message);
	}

	if((shouldThrow && actual && expected && !Assert.expectedException(actual, expected)) || (!shouldThrow && actual)) {
		throw actual;
	}
};

Assert.expectedException =  function(actual, expected) {
	if(!actual || !expected) {
		return false;
	}

	if(Object.prototype.toString.call(expected) == '[object RegExp]') {
		return expected.test(actual);
	}
	else if(actual instanceof expected) {
		return true;
	}
	else if(expected.call({}, actual) === true) {
		return true;
	}

	return false;
};

Assert.throws = function(block, error, message) {
	try {
		Assert.doesThrow.apply(this, [true].concat(Array.prototype.slice.call(arguments)));
		
		Framework.emit('Assert.finished', {
			status: 'passed',
			assertion: 'throws',
			message: message,
		});
	}
	catch(error) {
		Error.captureStackTrace(error, arguments.callee);

		Framework.emit('Assert.finished', {
			status: 'failed',
			assertion: 'throws',
			message: message,
			error: error,
		});

		throw error;
	}
};

Assert.doesNotThrow = function(block, message) {
	try {
		Assert.doesThrow.apply(this, [false].concat(Array.prototype.slice.call(arguments)));
		
		Framework.emit('Assert.finished', {
			status: 'passed',
			assertion: 'doesNotThrow',
			message: message,
		});
	}
	catch(error) {
		Error.captureStackTrace(error, arguments.callee);

		Framework.emit('Assert.finished', {
			status: 'failed',
			assertion: 'doesNotThrow',
			message: message,
			error: error,
		});

		throw error;
	}
};

// Export
module.exports = Assert;