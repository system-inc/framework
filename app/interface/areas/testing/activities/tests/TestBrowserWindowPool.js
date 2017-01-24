// Dependencies
import Pool from 'framework/system/pool/Pool.js';
import TestBrowserWindow from 'interface/areas/testing/activities/tests/browser-windows/TestBrowserWindow.js';

// Class
class TestBrowserWindowPool extends Pool {

	reusableClass = TestBrowserWindow;
	minimumSize = 1;
	maximumSize = 4;
	createReusablesAsNecessary = false;
	timeInMillisecondsToWaitToRetireAvailableReusables = 1 * 1000;

}

// Export
export default TestBrowserWindowPool;
