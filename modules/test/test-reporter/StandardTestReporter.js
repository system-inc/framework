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

	finishedRunningTests: function(data) {
		Console.out(Terminal.style("\n"+data.passes+' passing', 'green')+' '+this.getElapsedTimeString(data.stopwatch.elapsedTime, data.stopwatch.time.precision));
		
		if(data.failures > 0) {
			Console.out(Terminal.style(data.failures+' failing', 'red'));

			data.failedTests.each(function(index, failedTest) {
				Console.out("\n"+'('+(index + 1)+') '+ failedTest.test.name+'.'+failedTest.method+'() '+Terminal.style('('+failedTest.test.directory+failedTest.test.fileName+')', 'gray')+"\n");
				Console.out(Terminal.style(Console.prepareMessage.call(this, [failedTest.error]), 'gray'));
			});
		}

		Console.out('');
	},	

	finishedRunningTest: function(data) {
		// If there are no test methods
		if(this.currentTestMethodCount == 0) {
			Console.out(Terminal.style('    No test methods found. Make sure to prefix test method names with "test", e.g., "testMethod".', 'gray'));
		}

		this.currentTestMethodCount = 0;
	},

	finishedRunningTestMethod: function(data) {
		if(data.status == 'passed') {
			Console.out('    '+Terminal.style('✓', 'green')+' '+data.name.replaceFirst('test', '').lowercaseFirstCharacter()+' ('+this.currentTestMethodAssertionCount+' '+(this.currentTestMethodAssertionCount == 1 ? 'assertion' : 'assertions')+') '+this.getElapsedTimeString(data.stopwatch.elapsedTime, data.stopwatch.time.precision, true, 5, 30));
		}
		else if(data.status == 'failed') {
			Console.out('    '+Terminal.style('✗ ('+this.failedTests.length+') '+data.name.replaceFirst('test', '').lowercaseFirstCharacter()+' '+this.getElapsedTimeString(data.stopwatch.elapsedTime, data.stopwatch.time.precision, true, 5, 30), 'red'));
		}

		this.currentAssertions.each(function(index, assertionData) {
			if(assertionData.status == 'passed') {
				Console.out('      '+Terminal.style('✓', 'green')+' Assert.'+assertionData.assertion);
			}
			else if(assertionData.status == 'failed') {
				Console.out('      '+Terminal.style('✗ Assert.'+assertionData.assertion, 'red'));
			}
		});

		this.currentTestMethodCount++;
		this.currentTestMethodAssertionCount = 0;
		this.currentAssertions = [];
	},

	finishedAssert: function(data) {
		this.currentAssertions.push(data);
		this.currentTestMethodAssertionCount++;
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