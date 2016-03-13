// Class
var Test = Class.extend({

	shouldRun: function*() {
		return true;
	},

	before: function*() {
		//Console.log('Before');
	},

	beforeEach: function*() {
		//Console.log('Before each');
	},

	after: function*() {
		//Console.log('After');
	},

	afterEach: function*() {
		//Console.log('After each');
	},
	
});

// Export
module.exports = Test;