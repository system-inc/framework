// Dependencies
import Test from './../../../system/test/Test.js';
import Assert from './../../../system/test/Assert.js';
import Cryptography from './../../../system/cryptography/Cryptography.js';

// Class
class CryptographyTest extends Test {

	async testRandom() {
		var actual = await Cryptography.random();
		Assert.greaterThanOrEqualTo(actual, 0, 'between 0 (inclusive)');
		Assert.lessThan(actual, 1, 'and 1 (exclusive)');
	}

}

// Export
export default CryptographyTest;
