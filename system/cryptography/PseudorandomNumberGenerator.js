// Dependencies
import { Cryptography } from '@framework/system/cryptography/Cryptography.js';

// Class
class PseudorandomNumberGenerator {

    seed = null;
    currentValue = null;
    currentIndex = 0;

    // These values create good randomness
    // https://en.wikipedia.org/wiki/Linear_congruential_generator
    static modulus = BigInt(Math.pow(2, 64));
    static multiplier = 6364136223846793005n;
    static increment = 1442695040888963407n;

	constructor(seed = 'seed') {
        this.setSeed(seed);
    }

    setSeed(seed) {
        this.seed = seed;

        // Convert strings hex values which will convert into big integers
        if(String.is(seed)) {
            seed = '0x'+Cryptography.hash(seed);
        }
        
        this.currentValue = BigInt(seed) % PseudorandomNumberGenerator.modulus;
        this.currentIndex = 0;
    }

    // Returns a large number between 0 and 2^64 - 1 (the modulus)
    random() {
        // Use the linear congruential generator method
        this.currentValue = (this.currentValue * PseudorandomNumberGenerator.multiplier + PseudorandomNumberGenerator.increment) % PseudorandomNumberGenerator.modulus;

        // Keep track of how many times random has been called
        this.currentIndex++;

        return this.currentValue;
    }

    // Get a random number at a specific index in the sequence
    randomAtIndex(index) {
        var newPseudoRandomNumberGenerator = new PseudorandomNumberGenerator(this.seed);
        while(newPseudoRandomNumberGenerator.currentIndex < index-1) {
            newPseudoRandomNumberGenerator.random();
        }
        return newPseudoRandomNumberGenerator.random();
    }

    randomNumber(minimum = 0, maximum = 1, precision = 0) {
        // Get a random number between 0 and the modulus - 1
        let randomNumber = this.random();

        // Divide the random number by the modulus to get a percentage
        randomNumber = Number(randomNumber) / Number(PseudorandomNumberGenerator.modulus);

        // Apply the percentage to the range to get a number between the minimum and maximum (inclusive)
        randomNumber = Math.floor((maximum + 1 - minimum) * randomNumber) + minimum;

        // If we need precision, we need another random number (we do not steal randomness from the previous random number)
        if(precision > 0) {
            let randomDecimals = Number(this.random()) / Number(PseudorandomNumberGenerator.modulus);
            randomNumber = Number(randomNumber.toString() + '.' + randomDecimals.toString().substring(2, precision+2));
        }

        return randomNumber;
    }

    randomNumberWithNormalDistribution(minimum = 0, maximum = 100, skew = 1) {
        // Get two random floats between 0 and 1
        let float1 = Number(this.random()) / Number(PseudorandomNumberGenerator.modulus);
        let float2 = Number(this.random()) / Number(PseudorandomNumberGenerator.modulus);
        
        // Use these two floats to apply the normal distribution
        let randomNumber = Math.sqrt(-2 * Math.log(float1)) * Math.cos(2 * Math.PI * float2);
        
        // Translate to 0 -> 1
        randomNumber = randomNumber / 10.0 + 0.5;

        // Resample between 0 and 1 if out of range
        if(randomNumber > 1 || randomNumber < 0) {
            return this.randomNumberWithNormalDistribution(minimum, maximum, skew);
        }

        // Apply the skew
        randomNumber = Math.pow(randomNumber, skew);

        // Apply range
        return Math.round((maximum - minimum) * randomNumber) + minimum;
    }

    randomBoolean() {
        return this.randomNumber(0, 1) === 1;
    }

    randomCharacter() {
        return String.fromCharCode(this.randomNumber(0, 255));
    }

    randomString(length = 16) {
        let randomString = '';
        
        for(let i = 0; i < length; i++) {
            randomString += this.randomCharacter();
        }

        return randomString;
    }

}

// Export
export { PseudorandomNumberGenerator };
