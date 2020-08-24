// Dependencies
import { TestReporter } from '@framework/system/test/test-reporters/TestReporter.js';
import { AssertionError } from '@framework/system/test/errors/AssertionError.js';

// Class
class DotTestReporter extends TestReporter {

	startedRunningTests(data) {
		super.startedRunningTests(data);
		
		app.standardStreams.output.write("\n");
	}

	startedRunningTest(data) {
		// Do nothing
	}

	finishedRunningTestMethod(data) {
		// Line break at every 80 characters
		if(this.totalTestMethodCount > 1 && this.totalTestMethodCount % 80 === 1)  {
			app.standardStreams.output.write("\n");
		}

		if(data.status == 'passed') {
			app.standardStreams.output.write(Terminal.style('●', 'white'));
		}
		else if(data.status == 'failed') {
			app.standardStreams.output.write(Terminal.style('●', 'red'));
		}
		else if(data.status == 'skipped') {
			app.standardStreams.output.write(Terminal.style('●', 'gray'));
		}
	}

	finishedRunningTests(data) {
		app.standardStreams.output.write("\n");

		super.finishedRunningTests(...arguments);
	}

}

// Export
export { DotTestReporter };
