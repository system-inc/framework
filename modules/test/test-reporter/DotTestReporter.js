DotTestReporter = TestReporter.extend({

	currentTestName: null,
	currentTestMethod: null,
	totalTestMethodCount: 0,
	currentTestMethodCount: 0,
	currentTestMethodAssertionCount: 0,
	currentAssertions: [],
	passedAssertionCount: 0,
	failedAssertionCount: 0,

	construct: function() {
		this.on('TestReporter.startedRunningTests', this.startedRunningTests.bind(this));
		this.on('TestReporter.startedRunningTest', this.startedRunningTest.bind(this));
		this.on('TestReporter.startedRunningTestMethod', this.startedRunningTestMethod.bind(this));
		this.on('TestReporter.finishedRunningTests', this.finishedRunningTests.bind(this));
		this.on('TestReporter.finishedRunningTest', this.finishedRunningTest.bind(this));
		this.on('TestReporter.finishedRunningTestMethod', this.finishedRunningTestMethod.bind(this));
		this.on('Assert.finished', this.finishedAssert.bind(this));
	},

	startedRunningTests: function(data) {
		// Clear the terminal
		//Terminal.clear();
	},

	startedRunningTest: function(data) {
	},

	startedRunningTestMethod: function(data) {
	},

	finishedAssert: function(data) {
		this.currentAssertions.push(data);
		this.currentTestMethodAssertionCount++;
		
		if(data.status == 'passed') {
			this.passedAssertionCount++;
		}
		else if(data.status == 'failed') {
			this.failedAssertionCount++;
		}
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

		this.totalTestMethodCount++;
		this.currentTestMethodCount++;
		this.currentTestMethodAssertionCount = 0;
		this.currentAssertions = [];
	},

	finishedRunningTest: function(data) {
		this.currentTestMethodCount = 0;
	},	

	finishedRunningTests: function(data) {
		Console.out(Terminal.style("\n\n"+'✓ '+data.passes+' passing ('+this.passedAssertionCount+' assertions)', 'green')+' '+this.getElapsedTimeString(data.stopwatch.elapsedTime, data.stopwatch.time.precision));
		
		if(data.failures > 0) {
			Console.out(Terminal.style(data.failures+' failing ('+this.failedAssertionCount+' assertions)', 'red'));

			data.failedTests.each(function(index, failedTest) {
				Console.out("\n"+'('+(index + 1)+') '+ failedTest.test.name+'.'+failedTest.method+'() threw '+failedTest.errorObject.identifier+' '+Terminal.style('('+failedTest.errorObject.message+')', 'gray'));
				if(!failedTest.errorObject.data.actual) {
					Console.out('    '+Terminal.style(failedTest.errorObject.message, 'red'));
				}
				else {
					Console.out('    '+Terminal.style(failedTest.errorObject.data.actual+' '+failedTest.errorObject.data.operator+' '+failedTest.errorObject.data.expected, 'red'));
				}
				
				Console.out('    '+failedTest.errorObject.location);

				var stackTrace = Console.prepareMessage.call(this, [failedTest.error]);
				Console.out("\n"+Terminal.style(stackTrace, 'gray'));
			});
		}

		Console.out('');
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