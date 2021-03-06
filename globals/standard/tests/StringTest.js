// Dependencies
import { Test } from '@framework/system/test/Test.js';
import { Assert } from '@framework/system/test/Assert.js';

// Class
class StringTest extends Test {

	testIs() {
		Assert.false(String.is(), 'nothing');
		Assert.false(String.is(0), '0');
		Assert.false(String.is(false), 'false');
		Assert.true(String.is(''), 'empty string');
		Assert.true(String.is('string'), 'string');
		Assert.true(String.is(String('string')), 'String() object');
	}

	testEmpty() {
		Assert.true(''.empty(), 'empty string');
		Assert.true(' '.empty(), 'string with whitespace');
		Assert.true('   '.empty(), 'string with more whitespace');
		Assert.true('	'.empty(), 'string with a tab');
		Assert.true(' 	 	   '.empty(), 'string with tabs and whitespace');
		Assert.false('string'.empty(), 'string with characters');
	}

	testContains() {
		Assert.true('aabbccaabbcc'.contains('a'));
		Assert.false('aabbccaabbcc'.contains('A', true));
		Assert.false('aabbccaabbcc'.contains('x'));

		Assert.equal('aabbccaabbcc'.contains('a'), 4);
		Assert.equal('aabbccaabbcc'.contains('aa'), 2);
		Assert.equal('aabbccaabbcc'.contains('A', true), 0);
	}

	testCount() {
		Assert.true('aabbccaabbcc'.count('a'));
		Assert.false('aabbccaabbcc'.count('A', true));
		Assert.false('aabbccaabbcc'.count('x'));

		Assert.equal('aabbccaabbcc'.count('a'), 4);
		Assert.equal('aabbccaabbcc'.count('aa'), 2);
		Assert.equal('aabbccaabbcc'.count('A', true), 0);
	}

	testUppercase() {
		var actual = 'test'.uppercase();
		var expected = 'TEST';
		Assert.equal(actual, expected, 'uppercase');
	}

	testUppercaseFirstCharacter() {
		var actual = 'test'.uppercaseFirstCharacter();
		var expected = 'Test';
		Assert.equal(actual, expected, 'uppercase first character');
	}

	testCapitalize() {
		var actual = 'test'.capitalize();
		var expected = 'Test';
		Assert.equal(actual, expected, 'capitalize first character');

		actual = 'test string'.capitalize(true);
		expected = 'Test String';
		Assert.equal(actual, expected, 'capitalize every word');

		actual = 'test STRING'.capitalize(false, true);
		expected = 'Test string';
		Assert.equal(actual, expected, 'lowercase all words after first word');
	}

	testLowercase() {
		var actual = 'TEST'.lowercase();
		var expected = 'test';
		Assert.equal(actual, expected, 'lowercase');
	}

	testLowercaseFirstCharacter() {
		var actual = 'Test'.lowercaseFirstCharacter();
		var expected = 'test';
		Assert.equal(actual, expected, 'lowercase first character');
	}

	testReplace() {
		var actual = 'Test Hi Test Hi Test Hi'.replace('Hi', 'Hello');
		var expected = 'Test Hello Test Hello Test Hello';
		Assert.equal(actual, expected, 'replace all by default');
	}

	testReplaceFirst() {
		var actual = 'Apple Banana Cherry Apple'.replaceFirst('Apple', 'Date');
		var expected = 'Date Banana Cherry Apple';
		Assert.equal(actual, expected, 'only does first instance');
	}

	testReplaceLast() {
		var actual = 'Apple Banana Cherry Apple'.replaceLast('Apple', 'Date');
		var expected = 'Apple Banana Cherry Date';
		Assert.equal(actual, expected, 'only does last instance');
	}

	testReplaceSubstring() {
		var actual = 'Apple Banana Cherry'.replaceSubstring('Banana', 'Strawberry', 6);
		var expected = 'Apple Strawberry Cherry';
		Assert.equal(actual, expected, 'this is used by String.replaceLast');
	}

	testToNumber() {
		Assert.true(Number.is(''.toNumber()), 'change an empty string into the number 0');
		Assert.true(Number.is('1'.toNumber()), 'change the string "1" into the number 1');
	}

	testToInteger() {
		Assert.strictEqual(''.toInteger(), 0, 'change an empty string into the integer 0');
		Assert.strictEqual('1'.toInteger(), 1, 'change the string "1" into the integer 1');
		Assert.strictEqual('1.5'.toInteger(), 1, 'change the string "1.5" into the integer 1');
	}

	testToDashes() {
		var actual = 'Apple Banana Cherry Date'.toDashes();
		var expected = 'apple-banana-cherry-date';
		Assert.equal(actual, expected, 'turns spaces into dashes and lowercases everything');

		actual = 'Apple_Banana_Cherry_Date'.toDashes();
		expected = 'apple-banana-cherry-date';
		Assert.equal(actual, expected, 'turns underscores into dashes and lowercases everything');

		actual = 'appleBananaCherryDate'.toDashes();
		expected = 'apple-banana-cherry-date';
		Assert.equal(actual, expected, 'turns camelcase into dashes and lowercases everything');
	}

	testToSpaces() {
		var actual = 'AppleBananaCherryDate'.toSpaces();
		var expected = 'apple banana cherry date';
		Assert.equal(actual, expected, 'breaks connected capital letters with a space and lowercases everything');
	}

	async testUniqueIdentifier() {
		var uniqueIdentifier = String.uniqueIdentifier(8);
		Assert.equal(uniqueIdentifier.length, 8, 'Unique identifier uses length parameter');

		// Just having some fun collision hunting
		//var generatedUniqueIdentifiers = {};

		//for(var i = 0; i < 10000 * 10000; i++) {
		//	//var uniqueIdentifier = yield String.cryptographicRandom(16);
		//	//var uniqueIdentifier = String.random(16);
		//	var uniqueIdentifier = String.uniqueIdentifier(8);

		//	var collision = false;
		//	if(generatedUniqueIdentifiers[uniqueIdentifier]) {
		//		collision = uniqueIdentifier;
		//	}

		//	if(collision) {
		//		throw new Error('Collision on unique identifier "'+collision+'" after '+i+' unique identifiers generated.');
		//	}
		//	else {
		//		generatedUniqueIdentifiers[uniqueIdentifier] = true;
		//	}

		//	if((i + 1) % 10000 == 0) {
		//		app.log('Generated '+Number.addCommas(i + 1)+' unique identifiers without collision.');
		//	}
		//}
	}

	testRandom() {
		var string = String.random(32);
		Assert.equal(string.length, 32, 'observes length parameter');

		string = String.random(1024, '01');
		Assert.true(string.contains('1'), 'observes character set'); // LOL this theoretically could fail if we roll 1024 0's in a row
	}

	testSizeInBytes() {
		Assert.equal(''.sizeInBytes(), 0, 'empty string has no size');
		Assert.equal(' '.sizeInBytes(), 1, 'space is 1 byte');
		Assert.equal('	'.sizeInBytes(), 1, 'tab is 1 byte');
		Assert.equal('123'.sizeInBytes(), 3, 'a character is a byte');
		Assert.equal('ヸ'.sizeInBytes(), 3, 'some single unicode characters are larger than a byte');
	}

	testCharacterCodeAt() {
		Assert.equal('\uD800\uDC00'.characterCodeAt(0), 65536, 'correct character code');
	}

	testSplitOnFirst() {
		let string = 'Key: Value : Test1 : Test2: : ';
		let actual = string.splitOnFirst(': ');
		// app.log('actual', actual);

		Assert.deepEqual(
			actual,
			[
				'Key',
				'Value : Test1 : Test2: : ',
			],
			'array only includes two values'
		);
	}

}

// Export
export { StringTest };
