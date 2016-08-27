// Dependencies
import TestReporter from './TestReporter.js';
import ConciseTestReporter from './ConciseTestReporter.js';
import Terminal from './../../../system/console/Terminal.js';
var AssertionError = Node.Assert.AssertionError;

// Class
class StandardTestReporter extends TestReporter {

	finishedRunningTestMethod(data) {
		this.super.apply(this, arguments);

		// Print out the assertions
		this.currentAssertions.each(function(index, assertionData) {
			// The assertion passed
			if(assertionData.status == 'passed') {
				app.log(Terminal.style('      ✓', 'green')+' Assert.'+assertionData.assertion+Terminal.style((assertionData.message ? ' ('+assertionData.message+')' : ' (no message)'), 'gray'));
			}
			// The assertion failed
			else if(assertionData.status == 'failed') {
				// Show the assertion error message
				app.log(Terminal.style('      ✗ Assert.'+assertionData.assertion+(assertionData.message ? ' ('+assertionData.message+')' : ' (no message)'), 'red'));

				// If we have AssertionError data (Node's AssertionError has the properties 'actual', 'operator', and 'expected')
				if(Class.isInstance(assertionData.error, AssertionError)) {
					// Show the AssertionError data
					app.log(Terminal.style('        '+assertionData.error.actual+' '+assertionData.error.operator+' '+assertionData.error.expected, 'red'));
				}	
				else {
					app.log(Terminal.style('        (error is not an AssertionError)', 'red'));
				}
				
				// Show the location of the failed assertion
				if(Error.is(assertionData.error)) {
					var firstCallSiteData = assertionData.error.stack.getCallSiteData(0);
					app.log(Terminal.style('        ('+firstCallSiteData.file+':'+firstCallSiteData.lineNumber+':'+firstCallSiteData.columnNumber+')', 'red'));
				}
				else {
					app.log(Terminal.style('        (unknown location)', 'red'));
				}
			}
		});
	}

}

// Export
export default StandardTestReporter;
