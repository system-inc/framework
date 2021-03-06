// Dependencies
import { Pool } from '@framework/system/pool/Pool.js';
import { TestGraphicalInterfaceProxy } from '@app/interface/areas/testing/activities/tests/test-graphical-interface/TestGraphicalInterfaceProxy.js';

// Class
class TestGraphicalInterfaceProxyPool extends Pool {

	reusableClass = TestGraphicalInterfaceProxy;
	minimumSize = 0;
	maximumSize = 6;
	createReusablesAsNecessary = false;
	timeInMillisecondsToWaitToRetireAvailableReusables = 1000 * 0.25;

}

// Export
export { TestGraphicalInterfaceProxyPool };
