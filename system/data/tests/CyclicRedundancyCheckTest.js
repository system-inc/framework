// Dependencies
import { Test } from '@framework/system/test/Test.js';
import { Assert } from '@framework/system/test/Assert.js';
import { CyclicRedundancyCheck } from '@framework/system/data/CyclicRedundancyCheck.js';

// Class
class CyclicRedundancyCheckTest extends Test {

    async testGetCrc32Simple1() {
        var actual = CyclicRedundancyCheck.getCrc32AsBuffer(Buffer.from('hey sup bros'));
        var expected = Buffer.from([0x47, 0xfa, 0x55, 0x70]);

        //console.log('actual', actual);
        //console.log('expected', expected);

        Assert.deepEqual(actual, expected, 'CRC-32 simple 1');
    }

    async testGetCrc32Simple2() {
        var actual = CyclicRedundancyCheck.getCrc32AsBuffer(Buffer.from('IEND'));
        var expected = Buffer.from([0xae, 0x42, 0x60, 0x82]);
        Assert.deepEqual(actual, expected, 'CRC-32 simple 2');
    }

    async testGetCrc32Complex1() {
        var actual = CyclicRedundancyCheck.getCrc32AsBuffer(Buffer.from([0x00, 0x00, 0x00]));
        var expected = Buffer.from([0xff, 0x41, 0xd9, 0x12]);
        Assert.deepEqual(actual, expected, 'CRC-32 complex 1');
    }

    async testGetCrc32Complex2() {
        var actual = CyclicRedundancyCheck.getCrc32AsBuffer(Buffer.from('शीर्षक'));
        var expected = Buffer.from([0x17, 0xb8, 0xaf, 0xf1]);
        Assert.deepEqual(actual, expected, 'CRC-32 complex 2');
    }

    async testGetCrc32AsBuffer() {
        var actual = CyclicRedundancyCheck.getCrc32AsBuffer('शीर्षक');
        var expected = Buffer.from([0x17, 0xb8, 0xaf, 0xf1]);
        Assert.deepEqual(actual, expected, 'CRC-32 casts to buffer');
    }

    async testGetCrc32AsSignedInteger() {
        var actual = CyclicRedundancyCheck.getCrc32AsSignedInteger('ham sandwich');
        var expected = -1891873021;
        Assert.deepEqual(actual, expected, 'CRC-32 signed');
    }

    async testGetCrc32AsUnsignedInteger() {
        var actual = CyclicRedundancyCheck.getCrc32AsUnsignedInteger('bear sandwich');
        var expected = 3711466352;
        Assert.deepEqual(actual, expected, 'CRC-32 unsigned');
    }

    async testGetCrc32Appending() {
        var input = [Buffer.from('hey'), Buffer.from(' '), Buffer.from('sup'), Buffer.from(' '), Buffer.from('bros')];

        var actual = 0;
        for(var i = 0; i < input.length; i++) {
            actual = CyclicRedundancyCheck.getCrc32AsBuffer(input[i], actual);
        }

        var expected = Buffer.from([0x47, 0xfa, 0x55, 0x70]);
        
        Assert.deepEqual(actual, expected, 'CRC-32 appending');
    }

    async testGetCrc32AsSignedIntegerAppending() {
        var input1 = 'ham';
        var input2 = ' ';
        var input3 = 'sandwich';
        
        var actual = CyclicRedundancyCheck.getCrc32AsSignedInteger(input1);
        actual = CyclicRedundancyCheck.getCrc32AsSignedInteger(input2, actual);
        actual = CyclicRedundancyCheck.getCrc32AsSignedInteger(input3, actual);
        
        var expected = -1891873021;
        
        Assert.deepEqual(actual, expected, 'CRC-32 signed appending');
    }

    async testGetCrc32AsUnsignedIntegerAppending() {
        var input1 = 'bear san';
        var input2 = 'dwich';
        
        var actual = CyclicRedundancyCheck.getCrc32AsUnsignedInteger(input1);
        actual = CyclicRedundancyCheck.getCrc32AsUnsignedInteger(input2, actual);
        
        var expected = 3711466352;
        
        Assert.deepEqual(actual, expected, 'CRC-32 unsigned appending');
    }

    async testGetCrc32IntegersAsFirstArgument() {
        var actual = CyclicRedundancyCheck.getCrc32AsBuffer(0);
        var expected = Buffer.from([0x00, 0x00, 0x00, 0x00]);
        Assert.deepEqual(actual, expected, 'CRC-32 accepts integers as first argument');
    }

    async testGetCrc32ThrowsOnInvalidInput() {
        Assert.throws(function() {
            CyclicRedundancyCheck.getCrc32AsBuffer({}); // {} is invalid input
		}, 'CRC-32 throws on invalid input');
    }

    async testCastStringCrc32ToSignedInteger() {
        // CRC-32 'kirkouimet' == hex 'dcda36f1' = signed integer -589678863
        var actual = CyclicRedundancyCheck.castCrc32ToSignedInteger('dcda36f1');
        var expected = -589678863;
        Assert.equal(actual, expected, 'Casting strings to signed integer');
    }

}

// Export
export { CyclicRedundancyCheckTest };
