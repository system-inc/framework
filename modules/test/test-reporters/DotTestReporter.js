// Dependencies
var TestReporter = Framework.require('modules/test/test-reporters/TestReporter.js');
var Terminal = Framework.require('modules/console/Terminal.js');

// Class
var DotTestReporter = TestReporter.extend({

	startedRunningTests: function(data) {
		Console.write("\n");
	},

	startedRunningTest: function(data) {
		// Do nothing
	},

	finishedRunningTestMethod: function(data) {
		// Line break at every 80 characters
		if(this.totalTestMethodCount && this.totalTestMethodCount % 80 === 0)  {
			Console.write("\n");
		}

		if(data.status == 'passed') {
			Console.write(Terminal.style('●', 'white'));
		}
		else if(data.status == 'failed') {
			Console.write(Terminal.style('●', 'red'));
		}
	},

	finishedRunningTests: function(data) {
		Console.write("\n");

		this.super.apply(this, arguments);
	},

});

// Export
module.exports = DotTestReporter;