// Dependencies
var TestReporter = Framework.require('system/test/test-reporters/TestReporter.js');

// Class
var ElectronTestReporter = TestReporter.extend({

	startedRunningTests: function(data) {
		// Tell the user what we are doing
		Console.log('Running '+data.testMethodCount+' '+(data.testMethodCount == 1 ? 'test' : 'tests')+' in '+data.testCount+' test '+(data.testCount == 1 ? 'class' : 'classes')+'...');
	},

	startedRunningTest: function(data) {
		Console.log('  '+data.name.replaceLast('Test', '')+' ('+Node.Path.join(data.directory, data.fileName)+')');
	},

	finishedRunningTestMethod: function(data) {
		//Console.log('    finishedRunningTestMethod', data);	

		if(data.status == 'passed') {
			Console.log('    ✓ '+data.name.replaceFirst('test', '').lowercaseFirstCharacter()+' ('+this.currentTestMethodAssertionCount+' '+(this.currentTestMethodAssertionCount == 1 ? 'assertion' : 'assertions')+') '+this.getElapsedTimeString(data.stopwatch.elapsedTime, data.stopwatch.time.precision, true, 5, 30));
		}
		else if(data.status == 'failed') {
			Console.error('    ✗ ('+data.failedTests.length+') '+data.name.replaceFirst('test', '').lowercaseFirstCharacter()+' '+this.getElapsedTimeString(data.stopwatch.elapsedTime, data.stopwatch.time.precision, true, 5, 30));
		}
	},

	finishedRunningTests: function(data) {
		Console.log(data.passes+' passing ('+this.passedAssertionCount+' assertions) '+this.getElapsedTimeString(data.stopwatch.elapsedTime, data.stopwatch.time.precision));
		
		if(data.failures > 0) {
			Console.log(data.failures+' failing ('+this.failedAssertionCount+' assertions)');

			data.failedTests.each(function(index, failedTest) {
				Console.log('('+(index + 1)+') '+ failedTest.test.name+'.'+failedTest.method+'() threw '+failedTest.errorObject.identifier+' ('+failedTest.errorObject.message+')');
				if(!failedTest.errorObject.data.actual) {
					Console.log('    '+failedTest.errorObject.message);
				}
				else {
					Console.log('    '+failedTest.errorObject.data.actual+' '+failedTest.errorObject.data.operator+' '+failedTest.errorObject.data.expected);
				}
				
				Console.log('    '+failedTest.errorObject.location);

				var stackTrace = Console.prepareMessage.call(this, [failedTest.error]);
				Console.log(stackTrace);
			});
		}

		if(data.leakedGlobals.length) {
			Console.log('Leaked global variables: '+data.leakedGlobals.join(', '));
		}
	},

	getElapsedTimeString: function(elapsedTime, precision, useThresholds, warningThreshold, errorThreshhold) {
		return '('+Number.addCommas(Number.round(elapsedTime, 3))+' '+precision+')';
	},

});

// Export
module.exports = ElectronTestReporter;