// Dependencies
import Pool from 'framework/system/pool/Pool.js';
import TestBrowserWindow from 'interface/areas/testing/activities/tests/test-browser-window/TestBrowserWindow.js';

// Class
class TestBrowserWindowPool extends Pool {

	reusableClass = TestBrowserWindow;
	minimumSize = 4;
	maximumSize = 8;
	createReusablesAsNecessary = false;
	timeInMillisecondsToWaitToRetireAvailableReusables = 1000 * .25;

}

// Export
export default TestBrowserWindowPool;
