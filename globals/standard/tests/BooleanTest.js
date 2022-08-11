// Dependencies
import { Test } from '@framework/system/test/Test.js';
import { Assert } from '@framework/system/test/Assert.js';

// Class
class BooleanTest extends Test {

	testIs() {
		Assert.true(Boolean.is(false), 'false');
		Assert.true(Boolean.is(true), 'true');
		
		Assert.false(Boolean.is(), 'nothing');
		Assert.false(Boolean.is(undefined), 'undefined');
		Assert.false(Boolean.is(0), '0');
		Assert.false(Boolean.is(''), 'empty string');
		Assert.false(Boolean.is(null), 'null');
		Assert.false(Boolean.is(undefined), 'undefined');
		Assert.false(Boolean.is(NaN), 'NaN');
		Assert.false(Boolean.is(Infinity), 'Infinity');
		Assert.false(Boolean.is(-Infinity), '-Infinity');
	}

}

// Export
export { BooleanTest };
