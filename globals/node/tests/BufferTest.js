// Dependencies
import Test from './../../../system/test/Test.js';
import Assert from './../../../system/test/Assert.js';

// Class
class BufferTest extends Test {

	testIs() {
		Assert.true(Buffer.is(new Buffer('Buffer')), 'buffer object');
		Assert.false(Buffer.is(''), 'empty string');
		Assert.false(Buffer.is('string'), 'string');
	}

}

// Export
export default BufferTest;
