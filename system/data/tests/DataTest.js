// Dependencies
import Test from './../../../system/test/Test.js';
import Assert from './../../../system/test/Assert.js';
import Data from './../../../system/data/Data.js';

// Class
class DataTest extends Test {

	async testGzipEncodeDecode() {
		var actual = 'Encode and decode me.';

		actual = await Data.encode(actual, 'gzip');
		//Console.log(actual.toString());
		actual = await Data.decode(actual, 'gzip');
		//Console.log(actual);

		var expected = 'Encode and decode me.';

		Assert.equal(actual, expected, 'gzip encode and decode a string');
	}

}

// Export
export default DataTest;
