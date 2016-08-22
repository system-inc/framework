// Dependencies
import TestReporter from './TestReporter.js';
import Terminal from './../../../system/console/Terminal.js';

// Class
class DotTestReporter extends TestReporter {

	startedRunningTests(data) {
		Console.write("\n");
	}

	startedRunningTest(data) {
		// Do nothing
	}

	finishedRunningTestMethod(data) {
		// Line break at every 80 characters
		if(this.totalTestMethodCount > 1 && this.totalTestMethodCount % 80 === 1)  {
			Console.write("\n");
		}

		if(data.status == 'passed') {
			Console.write(Terminal.style('●', 'white'));
		}
		else if(data.status == 'failed') {
			Console.write(Terminal.style('●', 'red'));
		}
		else if(data.status == 'skipped') {
			Console.write(Terminal.style('●', 'gray'));
		}
	}

	finishedRunningTests(data) {
		Console.write("\n");

		this.super.apply(this, arguments);
	}

}

// Export
export default DotTestReporter;
