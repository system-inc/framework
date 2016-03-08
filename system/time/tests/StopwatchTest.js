// Dependencies
var Test = Framework.require('system/test/Test.js');
var Assert = Framework.require('system/test/Assert.js');
var Stopwatch = Framework.require('system/time/Stopwatch.js');

// Class
var StopwatchTest = Test.extend({

	testGetHighResolutionElapsedTime: function*() {
		var action = new Stopwatch();
		action.stop();

		Assert.true(Number.is(action.getHighResolutionElapsedTime()), 'getHighResolutionElapsedTime()');
	},

});

// Export
module.exports = StopwatchTest;