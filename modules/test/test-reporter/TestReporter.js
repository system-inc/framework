// Dependencies
var Terminal = Framework.require('modules/console/Terminal.js');

// Class
var TestReporter = Class.extend({

	currentTestName: null,
	currentTestMethod: null,
	totalTestMethodCount: 0,
	currentTestMethodCount: 0,
	currentTestMethodAssertionCount: 0,
	currentAssertions: [],
	passedAssertionCount: 0,
	failedAssertionCount: 0,

	construct: function() {
		this.on('TestReporter.startedRunningTests', function(data) {
			this.startedRunningTests(data);
		}.bind(this));

		this.on('TestReporter.startedRunningTest', function(data) {
			this.currentTestName = data.name;

			this.startedRunningTest(data);
		}.bind(this));

		this.on('TestReporter.startedRunningTestMethod', function(data) {
			this.startedRunningTestMethod(data);
		}.bind(this));

		this.on('TestReporter.finishedRunningTests', function(data) {
			this.finishedRunningTests(data);
		}.bind(this));

		this.on('TestReporter.finishedRunningTest', function(data) {
			this.finishedRunningTest(data);

			this.currentTestMethodCount = 0;
		}.bind(this));

		this.on('TestReporter.finishedRunningTestMethod', function(data) {
			this.totalTestMethodCount++;
			this.currentTestMethodCount++;

			this.finishedRunningTestMethod(data);

			this.currentTestMethodAssertionCount = 0;
			this.currentAssertions = [];
		}.bind(this));

		this.on('Assert.finished', function(data) {
			this.currentAssertions.append(data);
			this.currentTestMethodAssertionCount++;
			
			if(data.status == 'passed') {
				this.passedAssertionCount++;
			}
			else if(data.status == 'failed') {
				this.failedAssertionCount++;
			}

			this.finishedAssert(data);
		}.bind(this));
	},

	on: function(eventName, callback) {
		Framework.on(eventName, callback);
	},

	startedRunningTests: function(data) {
		// Clear the terminal
		//Terminal.clear();

		// Tell the user what we are doing
		Console.writeLine("\r\n"+'Running '+data.testMethodCount+' '+(data.testMethodCount == 1 ? 'test' : 'tests')+' in '+data.testCount+' test '+(data.testCount == 1 ? 'class' : 'classes')+'...');
	},

	startedRunningTest: function(data) {
		var testLocation = data.directory.replace(Project.framework.directory+'tests'+Node.Path.separator, '')+data.fileName;

		Console.writeLine("\n"+'  '+data.name.replaceLast('Test', '')+' '+Terminal.style('('+testLocation+')', 'gray')+"\n");
	},

	startedRunningTestMethod: function(data) {
		//Console.writeLine('    startedRunningTestMethod', data);
	},

	finishedAssert: function(data) {
		//Console.writeLine('    finishedAssert', data);
	},

	finishedRunningTestMethod: function(data) {
		//Console.writeLine('    finishedRunningTestMethod', data);	

		if(data.status == 'passed') {
			Console.writeLine('    '+Terminal.style('✓', 'green')+' '+data.name.replaceFirst('test', '').lowercaseFirstCharacter()+' ('+this.currentTestMethodAssertionCount+' '+(this.currentTestMethodAssertionCount == 1 ? 'assertion' : 'assertions')+') '+this.getElapsedTimeString(data.stopwatch.elapsedTime, data.stopwatch.time.precision, true, 5, 30));
		}
		else if(data.status == 'failed') {
			Console.writeLine('    '+Terminal.style('✗ ('+data.failedTests.length+') '+data.name.replaceFirst('test', '').lowercaseFirstCharacter()+' '+this.getElapsedTimeString(data.stopwatch.elapsedTime, data.stopwatch.time.precision, true, 5, 30), 'red'));
		}
	},

	finishedRunningTest: function(data) {
		//Console.writeLine('    finishedRunningTest', data);	
	},	

	finishedRunningTests: function(data) {
		Console.writeLine(Terminal.style("\n"+data.passes+' passing ('+this.passedAssertionCount+' assertions)', 'green')+' '+this.getElapsedTimeString(data.stopwatch.elapsedTime, data.stopwatch.time.precision));
		
		if(data.failures > 0) {
			Console.writeLine(Terminal.style(data.failures+' failing ('+this.failedAssertionCount+' assertions)', 'red'));

			data.failedTests.each(function(index, failedTest) {
				Console.writeLine("\n"+'('+(index + 1)+') '+ failedTest.test.name+'.'+failedTest.method+'() threw '+failedTest.errorObject.identifier+' '+Terminal.style('('+failedTest.errorObject.message+')', 'gray'));
				if(!failedTest.errorObject.data.actual) {
					Console.writeLine('    '+Terminal.style(failedTest.errorObject.message, 'red'));
				}
				else {
					Console.writeLine('    '+Terminal.style(failedTest.errorObject.data.actual+' '+failedTest.errorObject.data.operator+' '+failedTest.errorObject.data.expected, 'red'));
				}
				
				Console.writeLine('    '+failedTest.errorObject.location);

				var stackTrace = Console.prepareMessage.call(this, [failedTest.error]);
				Console.writeLine("\n"+Terminal.style(stackTrace, 'gray'));
			});
		}

		if(data.leakedGlobals.length) {
			Console.writeLine(Terminal.style('Leaked global variables: '+data.leakedGlobals.join(', '), 'red'));
		}

		Console.write("\n");
	},

	getElapsedTimeString: function(elapsedTime, precision, useThresholds, warningThreshold, errorThreshhold) {
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
	},

});

// Export
module.exports = TestReporter;