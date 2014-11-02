Assert = Node.Assert = require('assert');
Assert.true = Assert.ok;
Assert.false = function(value, message) {
	return Assert.equal(value, false, message);
}