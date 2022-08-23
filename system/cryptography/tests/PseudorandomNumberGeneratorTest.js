// Dependencies
import { Test } from '@framework/system/test/Test.js';
import { Assert } from '@framework/system/test/Assert.js';
import { PseudorandomNumberGenerator } from '@framework/system/cryptography/PseudorandomNumberGenerator.js';
import { AsciiChart } from '@framework/system/ascii-art/AsciiChart.js';

// Class
class PseudorandomNumberGeneratorTest extends Test {

	async testOrder() {
		// Create a psuedorandom number generator
		let psuedoRandomNumberGenerator = new PseudorandomNumberGenerator(101);

		// Get the first random number, this should be deterministic
		let randomNumber1 = psuedoRandomNumberGenerator.randomNumber(0, 1);
		Assert.equal(randomNumber1, 1, 'First random number for seed seed1');

		let randomNumber2 = psuedoRandomNumberGenerator.randomNumber(0, 1);
		Assert.equal(randomNumber2, 0, 'Second random number for seed seed1');

		let randomNumber3 = psuedoRandomNumberGenerator.randomNumber(0, 1);
		Assert.equal(randomNumber3, 1, 'Third random number for seed seed1');

		let randomNumber4 = psuedoRandomNumberGenerator.randomNumber(0, 100);
		Assert.equal(randomNumber4, 55, 'Fourth random number for seed seed1');

		let randomNumber5 = psuedoRandomNumberGenerator.randomNumber(0, 1000000, 0);
		Assert.equal(randomNumber5, 977643, 'Fifth random number for seed seed1');

		let randomNumber6 = psuedoRandomNumberGenerator.randomNumber(0, 0, 16);
		Assert.equal(randomNumber6, '0.6721336717853889', 'Sixth random number for seed seed1');

		let randomNumber7 = psuedoRandomNumberGenerator.randomNumber(0, 1000000, 16);
		Assert.equal(randomNumber7, '9408.983177450142', 'Sixth random number for seed seed1');

		let randomNumber8 = psuedoRandomNumberGenerator.randomNumber(1, 10, 1);
		Assert.equal(randomNumber8, '4.1', 'Seventh random number for seed seed1');
	}

	async testMultipleSeeds() {
		// Create the first psuedorandom number generator with the same seed
		let psuedoRandomNumberGenerator1 = new PseudorandomNumberGenerator('Seed A');
		let randomNumber1a = psuedoRandomNumberGenerator1.randomNumber(0, 1000000);
		let randomNumber1b = psuedoRandomNumberGenerator1.randomNumber(0, 1000000);
		let randomNumber1c = psuedoRandomNumberGenerator1.randomNumber(0, 1000000);

		// Create the second psuedorandom number generator
		let psuedoRandomNumberGenerator2 = new PseudorandomNumberGenerator('Seed A');
		let randomNumber2a = psuedoRandomNumberGenerator2.randomNumber(0, 1000000);
		let randomNumber2b = psuedoRandomNumberGenerator2.randomNumber(0, 1000000);
		let randomNumber2c = psuedoRandomNumberGenerator2.randomNumber(0, 1000000);

		// Create the third psuedorandom number generator with a different seed
		let psuedoRandomNumberGenerator3 = new PseudorandomNumberGenerator('Seed B');
		let randomNumber3a = psuedoRandomNumberGenerator2.randomNumber(0, 1000000);
		let randomNumber3b = psuedoRandomNumberGenerator2.randomNumber(0, 1000000);
		let randomNumber3c = psuedoRandomNumberGenerator2.randomNumber(0, 1000000);

		// Make sure numbers are the same
		Assert.equal(randomNumber1a, randomNumber2a, 'First random number matches for same seed');
		Assert.equal(randomNumber1b, randomNumber2b, 'Second random number matches for same seed');
		Assert.equal(randomNumber1c, randomNumber2c, 'Third random number matches for same seed');

		// Make sure the numbers are not the same for Seed B
		Assert.notEqual(randomNumber1a, randomNumber3a, 'First random number does not match for different seed');
		Assert.notEqual(randomNumber1b, randomNumber3b, 'Second random number does not match for different seed');
		Assert.notEqual(randomNumber1c, randomNumber3c, 'Third random number does not match for different seed');
	}

	async testRandomAtIndex() {
		// Create the psuedorandom number generator
		let psuedoRandomNumberGenerator = new PseudorandomNumberGenerator();

		let randomAtIndex1Expected = psuedoRandomNumberGenerator.random();

		// Skip 8 values
		for(let i = 0; i < 8; i++) {
			psuedoRandomNumberGenerator.random();
		}

		let randomAtIndex10Expected = psuedoRandomNumberGenerator.random();

		let randomAtIndex1Actual = psuedoRandomNumberGenerator.randomAtIndex(1);
		let randomAtIndex10Actual = psuedoRandomNumberGenerator.randomAtIndex(10);
		
		Assert.equal(randomAtIndex1Actual, randomAtIndex1Expected, 'Random at index 1');
		Assert.equal(randomAtIndex10Actual, randomAtIndex10Expected, 'Random at index 10');
	}

	async testBooleanRandomness() {
		// Create the psuedorandom number generator
		let psuedoRandomNumberGenerator = new PseudorandomNumberGenerator('seed1');
		
		let samples = 10;
		let trueCount = 0;

		let streaks = {};
		let currentStreak = 1;
		let lastBoolean = true;
		let sequence = '';

		for(let i = 0; i < samples; i++) {
			let boolean = psuedoRandomNumberGenerator.randomBoolean();

			sequence += boolean ? '1' : '0';
			
			if(boolean) {
				trueCount++;
			}

			if(lastBoolean == boolean) {
				currentStreak++;
			}
			else {
				if (streaks[currentStreak] === undefined) streaks[currentStreak] = 0;
				streaks[currentStreak]++;
				currentStreak = 1;
				lastBoolean = boolean;
			}
		}

		// console.log(sequence);
		// console.table(streaks);

		// Make sure the true count is close to 50%
		Assert.equal(trueCount / samples, 0.5, 'True count is close to 50%');
	}

	async testNormalDistribution() {
		// Create the psuedorandom number generator
		let psuedoRandomNumberGenerator = new PseudorandomNumberGenerator('seed3');
		
		let samples = 100;
		let occurrences = {};

		// Gather the samples
		for(let i = 0; i < samples; i++) {
			let value = psuedoRandomNumberGenerator.randomNumberWithNormalDistribution(0, 10);
			if(occurrences[value] === undefined) {
				occurrences[value] = 0;
			}

			occurrences[value]++;
		}

		console.table(occurrences);
		AsciiChart.draw(occurrences);

		Assert.equal(occurrences[2], 2, 'Occurrences of 2 is 2');
		Assert.equal(occurrences[3], 4, 'Occurrences of 3 is 4');
		Assert.equal(occurrences[4], 23, 'Occurrences of 4 is 23');
		Assert.equal(occurrences[5], 44, 'Occurrences of 5 is 44');
	}

}

// Export
export { PseudorandomNumberGeneratorTest };
