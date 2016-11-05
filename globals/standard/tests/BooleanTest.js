// Dependencies
import Test from 'system/test/Test.js';
import Assert from 'system/test/Assert.js';

// Class
class BooleanTest extends Test {

	testIs() {
		Assert.true(Boolean.is(false), 'false');
		Assert.true(Boolean.is(true), 'true');
		
		Assert.false(Boolean.is(), 'nothing');
		Assert.false(Boolean.is(undefined), 'undefined');
		Assert.false(Boolean.is(0), '0');
	}

}

// Export
export default BooleanTest;
