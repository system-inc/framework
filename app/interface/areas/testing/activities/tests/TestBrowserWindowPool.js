// Dependencies
import Pool from 'framework/system/pool/Pool.js';
import TestBrowserWindow from 'interface/areas/testing/activities/tests/test-browser-window/TestBrowserWindow.js';

// Class
class TestBrowserWindowPool extends Pool {

	minimumSize = 1;
	maximumSize = 4;
	createReusablesAsNecessary = false;
	timeInMillisecondsToWaitToRetireAvailableReusables = 1 * 1000;

	constructor() {
		super(TestBrowserWindow);
	}

}

// Export
export default TestBrowserWindowPool;
