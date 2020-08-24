// Dependencies
import { Test } from '@framework/system/test/Test.js';
import { Assert } from '@framework/system/test/Assert.js';

// Class
class NumberTest extends Test {

	testIs() {
		Assert.true(Number.is(0), '0');
		Assert.false(Number.is(null), 'null');
		Assert.true(Number.is(1), '1');
		Assert.false(Number.is('1'), 'the string "1"');
	}

	testIsInteger() {
		Assert.true(Number.isInteger(0), '0');
		Assert.false(Number.isInteger(null), 'null');
		Assert.true(Number.isInteger(1), '1');
		Assert.true(Number.isInteger('1'), 'the string "1"');
		Assert.true(Number.isInteger(-1), '-1');
		Assert.true(Number.isInteger('-1'), 'the string "-1"');
		Assert.false(Number.isInteger(1.1), '1.1');
		Assert.false(Number.isInteger('1.1'), 'the string "1.1"');
	}

	testPrototypeIsInteger() {
		Assert.true(new Number(0).isInteger(), '0');
		Assert.true(new Number(null).isInteger(), 'new Number(null) is actually the integer 0');
		Assert.true(new Number(1).isInteger(), '1');
		Assert.true(new Number('1').isInteger(), 'the string "1"');
		Assert.true(new Number(-1).isInteger(), '-1');
		Assert.true(new Number('-1').isInteger(), 'the string "-1"');
		Assert.false(new Number(1.1).isInteger(), '1.1');
		Assert.false(new Number("1.1").isInteger(), 'the string "1.1"');
	}

	testToInteger() {
		Assert.strictEqual(Number.toInteger(), 0, 'nothing gets converted to 0');
		Assert.strictEqual(Number.toInteger(null), 0, 'null gets converted to 0');
		Assert.strictEqual(Number.toInteger(0), 0, '0');
		Assert.strictEqual(Number.toInteger(1), 1, '1');
		Assert.strictEqual(Number.toInteger(1.0), 1, '1.0');
		Assert.strictEqual(Number.toInteger(1.1), 1, '1.1 gets converted to 1');
		Assert.strictEqual(Number.toInteger(1.5), 1, '1.5 gets converted to 1');
		Assert.strictEqual(Number.toInteger(1.9), 1, '1.9 gets converted to 1');
		Assert.strictEqual(Number.toInteger("0"), 0, '0');
		Assert.strictEqual(Number.toInteger("1"), 1, '1');
		Assert.strictEqual(Number.toInteger("1.0"), 1, '1.0');
		Assert.strictEqual(Number.toInteger("1.1"), 1, '1.1 gets converted to 1');
		Assert.strictEqual(Number.toInteger("1.5"), 1, '1.5 gets converted to 1');
		Assert.strictEqual(Number.toInteger("1.9"), 1, '1.9 gets converted to 1');
	}

	testPrototypeToInteger() {
		Assert.strictEqual(new Number(0).toInteger(), 0, '0');
		Assert.strictEqual(new Number(1).toInteger(), 1, '1');
		Assert.strictEqual(new Number(1.0).toInteger(), 1, '1.0');
		Assert.strictEqual(new Number(1.1).toInteger(), 1, '1.1 gets converted to 1');
		Assert.strictEqual(new Number(1.5).toInteger(), 1, '1.5 gets converted to 1');
		Assert.strictEqual(new Number(1.9).toInteger(), 1, '1.9 gets converted to 1');
	}

	testRound() {
		Assert.equal(Number.round(1), 1, '1 gets rounded to 1');
		Assert.equal(Number.round(1.0), 1, '1.0 gets rounded to 1');
		Assert.equal(Number.round(1.0000000001), 1, '1.0000000001 gets rounded to 1');
		Assert.equal(Number.round(1.1), 1, '1 gets rounded to 1');
		Assert.equal(Number.round(1.4999999999), 1, '1.4999999999 gets rounded to 1');
		Assert.equal(Number.round(1.5), 2, '1.5 gets rounded to 2');
		Assert.equal(Number.round(1.9), 2, '1.9 gets rounded to 2');

		Assert.equal(Number.round(1, 2), 1, '1 rounded to precision 2 is 1');
		Assert.equal(Number.round(1.1, 2).toString(), '1.10', '1.1 rounded to precision 2 and converted to a string is "1.10"');
		Assert.throws(function() { Number.round(1.123, -1); }, RangeError, '1.123 rounded to precision -1 should throw a RangeError');
		Assert.equal(Number.round(1.123, 0), 1, '1.123 rounded to precision 0 is 1');
		Assert.equal(Number.round(1.123, 1), 1.1, '1.123 rounded to precision 1 is 1.1');
		Assert.equal(Number.round(1.123, 2), 1.12, '1.123 rounded to precision 2 is 1.12');
		Assert.equal(Number.round(1.123, 3), 1.123, '1.123 rounded to precision 3 is 1.123');
		Assert.equal(Number.round(1.123, 4).toString(), '1.1230', '1.123 rounded to precision 4 and converted to a string is "1.1230"');
	}

	testAddCommas() {
		Assert.equal(Number.addCommas(), '', 'nothing goes to nothing');
		Assert.equal(Number.addCommas(0), '0', '0 goes to 0');
		Assert.equal(Number.addCommas(1), '1', '1 goes to 1');
		Assert.equal(Number.addCommas(10), '10', '10 goes to 10');
		Assert.equal(Number.addCommas(100), '100', '100 goes to 100');
		Assert.equal(Number.addCommas(1000), '1,000', '1000 goes to 1,000');
		Assert.equal(Number.addCommas(10000), '10,000', '10000 goes to 10,000');
		Assert.equal(Number.addCommas(100000), '100,000', '100000 goes to 100,000');
		Assert.equal(Number.addCommas(1000000), '1,000,000', '10000000 goes to 1,000,000');
		Assert.equal(Number.addCommas(1000000000), '1,000,000,000', '10000000000 goes to 1,000,000,000');

		Assert.equal(Number.addCommas(0.123456), '0.123456', '0.123456 goes to 0.123456');
		Assert.equal(Number.addCommas(1.123456), '1.123456', '1 goes to 1.123456');
		Assert.equal(Number.addCommas(10.123456), '10.123456', '10.123456 goes to 10.123456');
		Assert.equal(Number.addCommas(100.123456), '100.123456', '100.123456 goes to 100.123456');
		Assert.equal(Number.addCommas(1000.123456), '1,000.123456', '1000.123456 goes to 1,000.123456');
		Assert.equal(Number.addCommas(10000.123456), '10,000.123456', '10000.123456 goes to 10,000.123456');
		Assert.equal(Number.addCommas(100000.123456), '100,000.123456', '100000.123456 goes to 100,000.123456');
		Assert.equal(Number.addCommas(1000000.123456), '1,000,000.123456', '10000000.123456 goes to 1,000,000.123456');
		Assert.equal(Number.addCommas(1000000000.123456), '1,000,000,000.123456', '10000000000.123456 goes to 1,000,000,000.123456');
	}

	testRandom() {
		var randomNumber = Number.random(0, 1);
		Assert.greaterThanOrEqualTo(randomNumber, 0, '0, 1 returns a number greater than or equal to 0');
		Assert.lessThanOrEqualTo(randomNumber, 1, '0, 1 returns a number less than or equal to 1');

		randomNumber = Number.random(0, .9, 1);
		Assert.greaterThanOrEqualTo(randomNumber, 0, '0, .9, 1 returns a number greater than or equal to 0');
		Assert.lessThanOrEqualTo(randomNumber, .9, '0, .9, 1 returns a number less than or equal to .9');

		randomNumber = Number.random(10000, 100000);
		Assert.greaterThanOrEqualTo(randomNumber, 10000, '10000, 100000 returns a number greater than or equal to 10000');
		Assert.lessThanOrEqualTo(randomNumber, 100000, '10000, 100000 returns a number less than or equal to 100000');
	}

	async testCryptographicRandom() {
		var randomNumber = await Number.cryptographicRandom(0, 1);
		Assert.greaterThanOrEqualTo(randomNumber, 0, '0, 1 returns a number greater than or equal to 0');
		Assert.lessThanOrEqualTo(randomNumber, 1, '0, 1 returns a number less than or equal to 1');

		randomNumber = await Number.cryptographicRandom(0, .9, 1);
		Assert.greaterThanOrEqualTo(randomNumber, 0, '0, .9, 1 returns a number greater than or equal to 0');
		Assert.lessThanOrEqualTo(randomNumber, .9, '0, .9, 1 returns a number less than or equal to .9');

		randomNumber = await Number.cryptographicRandom(10000, 100000);
		Assert.greaterThanOrEqualTo(randomNumber, 10000, '10000, 100000 returns a number greater than or equal to 10000');
		Assert.lessThanOrEqualTo(randomNumber, 100000, '10000, 100000 returns a number less than or equal to 100000');
	}

}

// Export
export { NumberTest };
