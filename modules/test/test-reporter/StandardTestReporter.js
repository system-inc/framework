StandardTestReporter = TestReporter.extend({

	currentTestName: null,
	currentTestMethod: null,
	currentTestMethodCount: 0,
	currentTestMethodAssertionCount: 0,
	currentAssertions: [],

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
		Terminal.clear();

		// Tell the user what we are doing
		Console.out('Running '+data.testMethodCount+' '+(data.testMethodCount == 1 ? 'test' : 'tests')+' in '+data.testCount+' test '+(data.testCount == 1 ? 'class' : 'classes')+'...');
	},

	startedRunningTest: function(data) {
		this.currentTestName = data.name;

		Console.out("\n"+'  '+data.name.replaceLast('Test', '')+"\n");
	},

	startedRunningTestMethod: function(data) {
		//Console.out('    startedRunningTestMethod', data);
	},

	finishedAssert: function(data) {
		this.currentAssertions.push(data);
		this.currentTestMethodAssertionCount++;
	},

	finishedRunningTestMethod: function(data) {
		if(data.status == 'passed') {
			Console.out('    '+Terminal.style('✓', 'green')+' '+data.name.replaceFirst('test', '').lowercaseFirstCharacter()+' ('+this.currentTestMethodAssertionCount+' '+(this.currentTestMethodAssertionCount == 1 ? 'assertion' : 'assertions')+') '+this.getElapsedTimeString(data.stopwatch.elapsedTime, data.stopwatch.time.precision, true, 5, 30));
		}
		else if(data.status == 'failed') {
			Console.out('    '+Terminal.style('✗ ('+data.failedTests.length+') '+data.name.replaceFirst('test', '').lowercaseFirstCharacter()+' '+this.getElapsedTimeString(data.stopwatch.elapsedTime, data.stopwatch.time.precision, true, 5, 30), 'red'));
		}

		// Print out the assertions
		this.currentAssertions.each(function(index, assertionData) {
			if(assertionData.status == 'passed') {
				Console.out('      '+Terminal.style('✓', 'green')+' Assert.'+assertionData.assertion+Terminal.style((assertionData.message ? ' ('+assertionData.message+')' : ''), 'gray'));
			}
			else if(assertionData.status == 'failed') {
				Console.out('      '+Terminal.style('✗ Assert.'+assertionData.assertion+(assertionData.message ? ' ('+assertionData.message+')' : ')'), 'red'));
				Console.out('      '+Terminal.style('  '+assertionData.errorObject.data.actual+' '+assertionData.errorObject.data.operator+' '+assertionData.errorObject.data.expected, 'red'));
				Console.out('      '+Terminal.style('  '+assertionData.errorObject.location, 'red'));
				
			}
		});

		this.currentTestMethodCount++;
		this.currentTestMethodAssertionCount = 0;
		this.currentAssertions = [];
	},

	finishedRunningTest: function(data) {
		// If there are no test methods
		if(this.currentTestMethodCount == 0) {
			Console.out(Terminal.style('    No test methods found. Make sure to prefix test method names with "test", e.g., "testMethod".', 'gray'));
		}

		this.currentTestMethodCount = 0;
	},	

	finishedRunningTests: function(data) {
		Console.out(Terminal.style("\n"+data.passes+' passing', 'green')+' '+this.getElapsedTimeString(data.stopwatch.elapsedTime, data.stopwatch.time.precision));
		
		if(data.failures > 0) {
			Console.out(Terminal.style(data.failures+' failing', 'red'));

			data.failedTests.each(function(index, failedTest) {
				Console.out("\n"+'('+(index + 1)+') '+ failedTest.test.name+'.'+failedTest.method+'() threw '+failedTest.errorObject.identifier+' '+Terminal.style('('+failedTest.errorObject.message+')', 'gray'));
				Console.out('    '+Terminal.style(failedTest.errorObject.data.actual+' '+failedTest.errorObject.data.operator+' '+failedTest.errorObject.data.expected, 'red'));
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