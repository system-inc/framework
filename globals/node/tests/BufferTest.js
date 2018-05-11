// Dependencies
import Test from 'framework/system/test/Test.js';
import Assert from 'framework/system/test/Assert.js';

// Class
class BufferTest extends Test {

	testIs() {
		Assert.true(Buffer.is(Buffer.from('Buffer')), 'buffer object');
		Assert.false(Buffer.is(''), 'empty string');
		Assert.false(Buffer.is('string'), 'string');
	}

}

// Export
export default BufferTest;
