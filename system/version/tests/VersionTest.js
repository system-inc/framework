// Dependencies
import Test from 'framework/system/test/Test.js';
import Assert from 'framework/system/test/Assert.js';
import Version from 'framework/system/version/Version.js';

// Class
class VersionTest extends Test {

	testConstruct() {
		var version = new Version('1.2.3.4');

		Assert.equal(version.major, 1, 'major');
		Assert.equal(version.minor, 2, 'minor');
		Assert.equal(version.patch, 3, 'patch');
		Assert.equal(version.patchMinor, 4, 'patchMinor');
	}

	testToString() {
		var version = new Version('1.2.3.4');
		var actual = version.toString();
		var expected = '1.2.3.4';
		Assert.equal(actual, expected, 'string generation out to patch minor');

		version = new Version('1.2.3');
		actual = version.toString();
		expected = '1.2.3';
		Assert.equal(actual, expected, 'string generation out to patch');

		version = new Version('1.2');
		actual = version.toString();
		expected = '1.2';
		Assert.equal(actual, expected, 'string generation out to minor');

		version = new Version('1');
		actual = version.toString();
		expected = '1.0';
		Assert.equal(actual, expected, 'string generation out to major always includes minor');
	}

}

// Export
export default VersionTest;
