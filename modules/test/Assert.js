Assert = Node.Assert = require('assert');

Assert.true = function(value, message) {
	try {
		Assert.ok(value, message);
		Framework.emit('Assert.finished', {
			status: 'passed',
			assertion: 'true',
			message: message,
		});
	}
	catch(error) {
		Framework.emit('Assert.finished', {
			status: 'failed',
			assertion: 'true',
			message: message,
		});
		throw error;
	}
};

Assert.false = function(value, message) {
	try {
		Assert.equal(value, false, message);
		Framework.emit('Assert.finished', {
			status: 'passed',
			assertion: 'false',
			message: message,
		});
	}
	catch(error) {
		Framework.emit('Assert.finished', {
			status: 'failed',
			assertion: 'false',
			message: message,
		});
		throw error;
	}
}