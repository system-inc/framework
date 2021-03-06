// Dependencies
import { Test } from '@framework/system/test/Test.js';
import { Assert } from '@framework/system/test/Assert.js';

// Class
class PrimitiveTest extends Test {

	testIs() {
		Assert.true(Primitive.is(0), '0');
		Assert.true(Primitive.is(1), '1');
		Assert.true(Primitive.is(100), '100');
		Assert.true(Primitive.is(''), 'empty string');
		Assert.true(Primitive.is('A string'), 'string');
		Assert.true(Primitive.is(true), 'true');
		Assert.true(Primitive.is(false), 'false');
		Assert.true(Primitive.is(null), 'null');
		Assert.true(Primitive.is(undefined), 'undefined');
		Assert.false(Primitive.is([]), 'array literal ([])');
		Assert.false(Primitive.is({}), 'object literal ({})');
		Assert.false(Primitive.is(function() {}), 'function');
	}

}

// Export
export { PrimitiveTest };
