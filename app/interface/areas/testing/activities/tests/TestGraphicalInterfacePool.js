// Dependencies
import Pool from 'framework/system/pool/Pool.js';
import TestGraphicalInterface from 'interface/areas/testing/activities/tests/test-graphical-interface/TestGraphicalInterface.js';

// Class
class TestGraphicalInterfacePool extends Pool {

	reusableClass = TestGraphicalInterface;
	minimumSize = 1;
	maximumSize = 6;
	createReusablesAsNecessary = false;
	timeInMillisecondsToWaitToRetireAvailableReusables = 1000 * .25;

}

// Export
export default TestGraphicalInterfacePool;
