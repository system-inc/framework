// Dependencies
import { Test } from '@framework/system/test/Test.js';
import { Assert } from '@framework/system/test/Assert.js';
import { Cryptography } from '@framework/system/cryptography/Cryptography.js';

// Class
class CryptographyTest extends Test {

	async testRandom() {
		var actual = await Cryptography.random();
		Assert.greaterThanOrEqualTo(actual, 0, 'between 0 (inclusive)');
		Assert.lessThan(actual, 1, 'and 1 (exclusive)');
	}

}

// Export
export { CryptographyTest };
