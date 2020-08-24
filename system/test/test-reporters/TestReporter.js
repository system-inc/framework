// Dependencies
import { Assert } from '@framework/system/test/Assert.js';
import { AssertionError } from '@framework/system/test/errors/AssertionError.js';

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

		this.proctor.on('proctor.startedRunningTests', function(event) {
			this.startedRunningTests(event.data);
		}.bind(this));

		this.proctor.on('proctor.startedRunningTest', function(event) {
			this.currentTestClassName = event.data.name;

			this.startedRunningTest(event.data);
		}.bind(this));

		this.proctor.on('proctor.startedRunningTestMethod', function(event) {
			this.startedRunningTestMethod(event.data);
		}.bind(this));

		this.proctor.on('proctor.finishedRunningTestMethod', function(event) {
			this.totalTestMethodCount++;
			this.currentTestMethodCount++;

			this.finishedRunningTestMethod(event.data);

			this.currentTestMethodAssertionCount = 0;
			this.currentAssertions = [];
		}.bind(this));

		this.proctor.on('proctor.finishedRunningTest', function(event) {
			this.finishedRunningTest(event.data);

			this.currentTestMethodCount = 0;
		}.bind(this));

		this.proctor.on('proctor.finishedRunningTests', function(event) {
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

		//app.standardStreams.output.writeLine('Proctor');

		app.standardStreams.output.writeLine("\n"+'Finding tests in: '+this.proctor.path);
		
		if(this.proctor.filePattern) {
			app.standardStreams.output.writeLine('Filtering file paths matching: '+this.proctor.filePattern);
		}
		
		if(this.proctor.methodPattern) {
			app.standardStreams.output.writeLine('Filtering methods matching: '+this.proctor.methodPattern);
		}
		
		if(this.proctor.breakOnError) {
			app.standardStreams.output.writeLine('Will stop running tests on the first error.');
		}

		app.standardStreams.output.writeLine("\n"+'Running '+data.testMethodCount+' '+(data.testMethodCount == 1 ? 'test' : 'tests')+' in '+data.testCount+' test '+(data.testCount == 1 ? 'class' : 'classes')+'...');
	}

	startedRunningTest(data) {
		app.standardStreams.output.writeLine("\n"+'  '+data.name+' '+Terminal.style('('+Node.Path.join(data.directory, data.fileName)+')', 'gray')+"\n");
	}

	startedRunningTestMethod(data) {
		//app.standardStreams.output.writeLine('    startedRunningTestMethod', data);
	}

	finishedAssert(data) {
		//app.standardStreams.output.writeLine('    finishedAssert', data);
	}

	finishedRunningTestMethod(data) {
		//app.standardStreams.output.writeLine('    finishedRunningTestMethod', data);	

		if(data.status == 'passed') {
			app.standardStreams.output.writeLine(Terminal.style('    ✓', 'green')+' '+data.name+' ('+this.currentTestMethodAssertionCount+' '+(this.currentTestMethodAssertionCount == 1 ? 'assertion' : 'assertions')+') '+this.getElapsedTimeString(data.stopwatch.getHighResolutionElapsedTime(), data.stopwatch.time.precision, true, 5, 30));
		}
		else if(data.status == 'failed') {
			app.standardStreams.output.writeLine(Terminal.style('    ✗ ('+data.failedTestMethods.length+') '+data.name+' '+this.getElapsedTimeString(data.stopwatch.getHighResolutionElapsedTime(), data.stopwatch.time.precision, true, 5, 30), 'red'));
		}
		else if(data.status == 'skipped') {
			app.standardStreams.output.writeLine(Terminal.style('    ↓ (skipped) ', 'gray')+data.name);
		}
	}

	finishedRunningTest(data) {
		//app.standardStreams.output.writeLine('    finishedRunningTest', data);	
	}

	finishedRunningTests(data) {
		//app.info('finishedRunningTests data', data);

		// Show the total passing tests
		var passingTestClassesCount = data.passedTestClasses.length;
		if(passingTestClassesCount == 0 && data.passedTestMethods.length) {
			passingTestClassesCount = 1;
		}
		app.standardStreams.output.writeLine(Terminal.style("\n"+data.passedTestMethods.length+' method'+(data.passedTestMethods.length == 1 ? '' : 's')+' passing with '+this.passedAssertionCount+' assertion'+(this.passedAssertionCount == 1 ? '' : 's')+' in '+passingTestClassesCount+' test class'+(passingTestClassesCount == 1 ? '' : 'es')+' ', 'green')+this.getElapsedTimeString(data.stopwatch.getHighResolutionElapsedTime(), data.stopwatch.time.precision));

		// If we have failures
		if(data.failedTestMethods.length > 0) {
			// Show the total failed tests
			app.standardStreams.output.writeLine(Terminal.style(data.failedTestMethods.length+' method'+(data.failedTestMethods.length == 1 ? '' : 's')+' failing with '+this.failedAssertionCount+' assertion'+(this.failedAssertionCount == 1 ? '' : 's')+' in '+data.failedTestClasses.length+' test class'+(data.failedTestClasses.length == 1 ? '' : 'es')+': '+data.failedTestClasses.join(', '), 'red'));
		}

		// Show the total skipped tests
		if(data.skippedTestMethods.length) {
			app.standardStreams.output.writeLine(Terminal.style(data.skippedTestMethods.length+' method'+(data.skippedTestMethods.length == 1 ? '' : 's')+' skipped in '+data.skippedTestClasses.length+' test class'+(data.skippedTestClasses.length == 1 ? '' : 'es'), 'gray'));
		}
		
		// Show the total leaked variables
		if(data.leakedGlobals.length) {
			app.standardStreams.output.writeLine(Terminal.style(data.leakedGlobals.length+' leaked global variable'+(data.leakedGlobals.length == 1 ? '' : 's')+': '+data.leakedGlobals.join(', '), 'red'));
		}

		// If we have failures
		if(data.failedTestMethods.length > 0) {
			// Show each failed test
			data.failedTestMethods.each(function(index, failedTest) {
				//app.log(index, failedTest);

				var errorIdentifier = failedTest.error.name;
				if(!errorIdentifier) {
					errorIdentifier = Json.encode(failedTest.error);
				}
				app.standardStreams.output.writeLine("\n"+'('+(index + 1)+') '+ failedTest.test.name+'.'+failedTest.method+'() threw '+errorIdentifier);	

				// Show the location of the failed test
				if(Error.is(failedTest.error)) {
					var firstCallSiteData = failedTest.error.stack.getCallSite(0);
					app.standardStreams.output.writeLine(Terminal.style('    ('+firstCallSiteData.file+':'+firstCallSiteData.lineNumber+':'+firstCallSiteData.columnNumber+')', 'gray'));	
				}
				else {
					app.standardStreams.output.writeLine(Terminal.style('    (unknown location)', 'gray'));
				}				

				// If we have AssertionError data (Node's AssertionError has the properties 'actual', 'operator', and 'expected')
				if(Class.isInstance(failedTest.error, AssertionError)) {
					app.standardStreams.output.writeLine('    '+Terminal.style(failedTest.error.actual+' '+failedTest.error.operator+' '+failedTest.error.expected, 'red'));	
				}
				else {
					app.standardStreams.output.writeLine(Terminal.style('    (error is not an AssertionError)', 'red'));
				}
				
				// Show the full error with stack trace
				if(Error.is(failedTest.error)) {
					app.standardStreams.output.writeLine('    '+failedTest.error.stack.toString().replace("\n", "\n    ").trim());
				}
				else {
					app.standardStreams.output.writeLine('    (stack trace not available)');
				}
			});
		}

		app.standardStreams.output.writeLine();
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
export { TestReporter };
