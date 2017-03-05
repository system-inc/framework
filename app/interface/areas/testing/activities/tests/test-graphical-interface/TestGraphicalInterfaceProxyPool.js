// Dependencies
import Pool from 'framework/system/pool/Pool.js';
import TestGraphicalInterfaceProxy from 'interface/areas/testing/activities/tests/test-graphical-interface/TestGraphicalInterfaceProxy.js';

// Class
class TestGraphicalInterfaceProxyPool extends Pool {

	reusableClass = TestGraphicalInterfaceProxy;
	minimumSize = 3;
	maximumSize = 6;
	createReusablesAsNecessary = false;
	timeInMillisecondsToWaitToRetireAvailableReusables = 1000 * .25;

}

// Export
export default TestGraphicalInterfaceProxyPool;
