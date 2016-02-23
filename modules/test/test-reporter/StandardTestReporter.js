// Dependencies
var TestReporter = Framework.require('modules/test/test-reporter/TestReporter.js');
var ConciseTestReporter = Framework.require('modules/test/test-reporter/ConciseTestReporter.js');
var Terminal = Framework.require('modules/console/Terminal.js');

// Class
var StandardTestReporter = TestReporter.extend({

	finishedRunningTestMethod: function(data) {
		this.super.apply(this, arguments);

		// Print out the assertions
		this.currentAssertions.each(function(index, assertionData) {
			if(assertionData.status == 'passed') {
				Console.writeLine('      '+Terminal.style('✓', 'green')+' Assert.'+assertionData.assertion+Terminal.style((assertionData.message ? ' ('+assertionData.message+')' : ' (no message)'), 'gray'));
			}
			else if(assertionData.status == 'failed') {
				Console.writeLine('      '+Terminal.style('✗ Assert.'+assertionData.assertion+(assertionData.message ? ' ('+assertionData.message+')' : ' (no message)'), 'red'));
				if(!assertionData.errorObject.data.actual) {
					Console.writeLine('      '+Terminal.style('  '+assertionData.errorObject.message, 'red'));
				}
				else {
					Console.writeLine('      '+Terminal.style('  '+assertionData.errorObject.data.actual+' '+assertionData.errorObject.data.operator+' '+assertionData.errorObject.data.expected, 'red'));
				}
				
				Console.writeLine('      '+Terminal.style('  '+assertionData.errorObject.location, 'red'));
			}
		});
	},

});

// Export
module.exports = StandardTestReporter;