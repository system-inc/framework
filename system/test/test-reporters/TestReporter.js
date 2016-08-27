// Dependencies
import Terminal from './../../../system/console/Terminal.js';
import Assert from './../Assert.js';
var AssertionError = Node.Assert.AssertionError;

// Class
class TestReporter {

	proctor = null;
	currentTestClassName = null;
	currentTestMethod = null;
	totalTestMethodCount = 0;
	currentTestMethodCount = 0;
	currentTestMethodAssertionCount = 0;
	currentAssertions = [];
	passedAssertionCount = 0;
	failedAssertionCount = 0;

	constructor(proctor) {
		this.proctor = proctor;

		this.proctor.on('Proctor.startedRunningTests', function(event) {
			this.startedRunningTests(event.data);
		}.bind(this));

		this.proctor.on('Proctor.startedRunningTest', function(event) {
			this.currentTestClassName = event.data.name;

			this.startedRunningTest(event.data);
		}.bind(this));

		this.proctor.on('Proctor.startedRunningTestMethod', function(event) {
			this.startedRunningTestMethod(event.data);
		}.bind(this));

		this.proctor.on('Proctor.finishedRunningTestMethod', function(event) {
			this.totalTestMethodCount++;
			this.currentTestMethodCount++;

			this.finishedRunningTestMethod(event.data);

			this.currentTestMethodAssertionCount = 0;
			this.currentAssertions = [];
		}.bind(this));

		this.proctor.on('Proctor.finishedRunningTest', function(event) {
			this.finishedRunningTest(event.data);

			this.currentTestMethodCount = 0;
		}.bind(this));

		this.proctor.on('Proctor.finishedRunningTests', function(event) {
			this.finishedRunningTests(event.data);
		}.bind(this));

		Assert.eventEmitter.on('Assert.finished', function(event) {
			this.currentAssertions.append(event.data);
			this.currentTestMethodAssertionCount++;
			
			if(event.data.status == 'passed') {
				this.passedAssertionCount++;
			}
			else if(event.data.status == 'failed') {
				this.failedAssertionCount++;
			}

			this.finishedAssert(event.data);
		}.bind(this));
	}

	startedRunningTests(data) {
		// Clear the terminal
		//Terminal.clear();

		// Tell the user what we are doing
		app.log("\n"+'Running '+data.testMethodCount+' '+(data.testMethodCount == 1 ? 'test' : 'tests')+' in '+data.testCount+' test '+(data.testCount == 1 ? 'class' : 'classes')+'...');
	}

	startedRunningTest(data) {
		app.log("\n"+'  '+data.name+' '+Terminal.style('('+Node.Path.join(data.directory, data.fileName)+')', 'gray')+"\n");
	}

	startedRunningTestMethod(data) {
		//app.log('    startedRunningTestMethod', data);
	}

	finishedAssert(data) {
		//app.log('    finishedAssert', data);
	}

	finishedRunningTestMethod(data) {
		//app.log('    finishedRunningTestMethod', data);	

		if(data.status == 'passed') {
			app.log(Terminal.style('    ✓', 'green')+' '+data.name+' ('+this.currentTestMethodAssertionCount+' '+(this.currentTestMethodAssertionCount == 1 ? 'assertion' : 'assertions')+') '+this.getElapsedTimeString(data.stopwatch.getHighResolutionElapsedTime(), data.stopwatch.time.precision, true, 5, 30));
		}
		else if(data.status == 'failed') {
			app.log(Terminal.style('    ✗ ('+data.failedTestMethods.length+') '+data.name+' '+this.getElapsedTimeString(data.stopwatch.getHighResolutionElapsedTime(), data.stopwatch.time.precision, true, 5, 30), 'red'));
		}
		else if(data.status == 'skipped') {
			app.log(Terminal.style('    ↓ (skipped) ', 'gray')+data.name);
		}
	}

	finishedRunningTest(data) {
		//app.log('    finishedRunningTest', data);	
	}

	finishedRunningTests(data) {
		//Console.info('finishedRunningTests data', data);

		// Show the total passing tests
		var passingTestClassesCount = data.passedTestClasses.length;
		if(passingTestClassesCount == 0 && data.passedTestMethods.length) {
			passingTestClassesCount = 1;
		}
		app.log(Terminal.style("\n"+data.passedTestMethods.length+' method'+(data.passedTestMethods.length == 1 ? '' : 's')+' passing with '+this.passedAssertionCount+' assertion'+(this.passedAssertionCount == 1 ? '' : 's')+' in '+passingTestClassesCount+' test class'+(passingTestClassesCount == 1 ? '' : 'es')+' ', 'green')+this.getElapsedTimeString(data.stopwatch.getHighResolutionElapsedTime(), data.stopwatch.time.precision));

		// If we have failures
		if(data.failedTestMethods.length > 0) {
			// Show the total failed tests
			app.log(Terminal.style(data.failedTestMethods.length+' method'+(data.failedTestMethods.length == 1 ? '' : 's')+' failing with '+this.failedAssertionCount+' assertion'+(this.failedAssertionCount == 1 ? '' : 's')+' in '+data.failedTestClasses.length+' test class'+(data.failedTestClasses.length == 1 ? '' : 'es')+': '+data.failedTestClasses.join(', '), 'red'));
		}

		// Show the total skipped tests
		if(data.skippedTestMethods.length) {
			app.log(Terminal.style(data.skippedTestMethods.length+' method'+(data.skippedTestMethods.length == 1 ? '' : 's')+' skipped in '+data.skippedTestClasses.length+' test class'+(data.skippedTestClasses.length == 1 ? '' : 'es'), 'gray'));
		}
		
		// Show the total leaked variables
		if(data.leakedGlobals.length) {
			app.log(Terminal.style(data.leakedGlobals.length+' leaked global variable'+(data.leakedGlobals.length == 1 ? '' : 's')+': '+data.leakedGlobals.join(', '), 'red'));
		}

		// If we have failures
		if(data.failedTestMethods.length > 0) {
			// Show each failed test
			data.failedTestMethods.each(function(index, failedTest) {
				//Console.log(index, failedTest);

				var errorIdentifier = failedTest.error.name;
				if(!errorIdentifier) {
					errorIdentifier = Json.encode(failedTest.error);
				}
				app.log("\n"+'('+(index + 1)+') '+ failedTest.test.name+'.'+failedTest.method+'() threw '+errorIdentifier);	

				// Show the location of the failed test
				if(Error.is(failedTest.error)) {
					var firstCallSiteData = failedTest.error.stack.getCallSiteData(0);
					app.log(Terminal.style('    ('+firstCallSiteData.file+':'+firstCallSiteData.lineNumber+':'+firstCallSiteData.columnNumber+')', 'gray'));	
				}
				else {
					app.log(Terminal.style('    (unknown location)', 'gray'));
				}				

				// If we have AssertionError data (Node's AssertionError has the properties 'actual', 'operator', and 'expected')
				if(Class.isInstance(failedTest.error, AssertionError)) {
					app.log('    '+Terminal.style(failedTest.error.actual+' '+failedTest.error.operator+' '+failedTest.error.expected, 'red'));	
				}
				else {
					app.log(Terminal.style('    (error is not an AssertionError)', 'red'));
				}
				
				// Show the full error with stack trace
				if(Error.is(failedTest.error)) {
					app.log('    '+failedTest.error.stack.toString().replace("\n", "\n    ").trim());
				}
				else {
					app.log('    (stack trace not available)');
				}
			});
		}

		Console.write("\n");
	}

	getElapsedTimeString(elapsedTime, precision, useThresholds, warningThreshold, errorThreshhold) {
		var elapsedTimeString = '('+Number.addCommas(Number.round(elapsedTime, 3))+' '+precision+')';
		var style = 'gray';

		// Color warning thresholds
		if(useThresholds && elapsedTime > warningThreshold) {
			style = 'yellow';
		}

		// Color error thresholds
		if(useThresholds && elapsedTime > errorThreshhold) {
			style = 'red';
		}

		return Terminal.style(elapsedTimeString, style);
	}

}

// Export
export default TestReporter;
