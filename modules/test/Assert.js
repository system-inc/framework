Assert = Node.Assert = require('assert');

Assert.standardEqual = Assert.equal;

Assert.equal = function(actual, expected, message) {
	try {
		Assert.standardEqual(actual, expected, message);
		
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
			errorObject: error.toObject(),
			error: error,
		});

		throw error;
	}
}

Assert.standardNotEqual = Assert.notEqual;

Assert.true = function(value, message) {
	try {
		if(!value) {
			Assert.fail(value, true, message, '==');
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
			errorObject: error.toObject(),
			error: error,
		});

		throw error;
	}
};

Assert.ok = Assert.true;

Assert.false = function(value, message) {
	try {
		if(value != false) {
			Assert.fail(value, false, message, '==');
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
			errorObject: error.toObject(),
			error: error,
		});

		throw error;
	}
}

Assert.notEqual = function(actual, expected, message) {
	try {
		Assert.standardNotEqual(actual, expected, message);
		
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
			errorObject: error.toObject(),
			error: error,
		});

		throw error;
	}
}

USE THIS CODE:
https://github.com/joyent/node/blob/master/lib/assert.js

Assert.standardDeepEqual = Assert.deepEqual;

Assert.deepEqual = function(actual, expected, message) {
	try {
		Assert.standardDeepEqual(actual, expected, message);
		
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
			errorObject: error.toObject(),
			error: error,
		});

		throw error;
	}
}

Assert.standardNotDeepEqual = Assert.deepEqual;

Assert.notDeepEqual = function(actual, expected, message) {
	try {
		Assert.standardNotDeepEqual(actual, expected, message);
		
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
			errorObject: error.toObject(),
			error: error,
		});

		throw error;
	}
}