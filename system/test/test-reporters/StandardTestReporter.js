// Dependencies
var TestReporter = Framework.require('system/test/test-reporters/TestReporter.js');
var ConciseTestReporter = Framework.require('system/test/test-reporters/ConciseTestReporter.js');
var Terminal = Framework.require('system/console/Terminal.js');

// Class
var StandardTestReporter = TestReporter.extend({

	finishedRunningTestMethod: function(data) {
		this.super.apply(this, arguments);

		// Print out the assertions
		this.currentAssertions.each(function(index, assertionData) {
			// The assertion passed
			if(assertionData.status == 'passed') {
				Console.writeLine('      '+Terminal.style('✓', 'green')+' Assert.'+assertionData.assertion+Terminal.style((assertionData.message ? ' ('+assertionData.message+')' : ' (no message)'), 'gray'));
			}
			// The assertion failed
			else if(assertionData.status == 'failed') {
				// Show the assertion error message
				Console.writeLine('      '+Terminal.style('✗ Assert.'+assertionData.assertion+(assertionData.message ? ' ('+assertionData.message+')' : ' (no message)'), 'red'));

				// If we have AssertionError data (Node's AssertionError has the properties 'actual', 'operator', and 'expected')
				if(assertionData.error.actual) {
					// Show the AssertionError data
					Console.writeLine('      '+Terminal.style('  '+assertionData.error.actual+' '+assertionData.error.operator+' '+assertionData.error.expected, 'red'));
				}
				
				// Show the location of the failed assertion
				var firstCallSiteData = assertionData.error.stack.getCallSiteData(0);
				Console.writeLine('      '+Terminal.style('  '+firstCallSiteData.file+':'+firstCallSiteData.lineNumber+':'+firstCallSiteData.columnNumber, 'red'));
			}
		});
	},

});

// Export
module.exports = StandardTestReporter;