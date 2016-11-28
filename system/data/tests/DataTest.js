// Dependencies
import Test from 'framework/system/test/Test.js';
import Assert from 'framework/system/test/Assert.js';
import Data from 'framework/system/data/Data.js';

// Class
class DataTest extends Test {

	async testGzipEncodeDecode() {
		var actual = 'Encode and decode me.';

		actual = await Data.encode(actual, 'gzip');
		//app.log(actual.toString());
		actual = await Data.decode(actual, 'gzip');
		//app.log(actual);

		var expected = 'Encode and decode me.';

		Assert.equal(actual, expected, 'gzip encode and decode a string');
	}

}

// Export
export default DataTest;
