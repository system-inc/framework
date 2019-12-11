// Dependencies
import Test from 'framework/system/test/Test.js';
import Assert from 'framework/system/test/Assert.js';
import CyclicRedundancyCheck from 'framework/system/data/CyclicRedundancyCheck.js';

// Class
class CyclicRedundancyCheckTest extends Test {

	async testGzipEncodeDecode() {
		var actual = 'Encode and decode me.';

		actual = await Data.encode(actual, 'gzip');
		//app.log(actual.toString());
		actual = await Data.decode(actual, 'gzip');
		//app.log(actual);

		var expected = 'Encode and decode me.';

		Assert.equal(actual, expected, 'gzip encode and decode a string');
    }

    async testGetCrc32ChecksumSimple1() {
        var actual = CyclicRedundancyCheck.getCrc32Checksum(new Buffer('hey sup bros'));
        var expected = new Buffer([0x47, 0xfa, 0x55, 0x70]);
        Assert.equal(actual, expected, 'getCrc32Checksum simple 1');
    }

    async testGetCrc32ChecksumSimple2() {
        var actual = CyclicRedundancyCheck.getCrc32Checksum(new Buffer('IEND'));
        var expected = new Buffer([0xae, 0x42, 0x60, 0x82]);
        Assert.equal(actual, expected, 'getCrc32Checksum simple 2');
    }

    async testGetCrc32ChecksumComplex1() {
        var actual = CyclicRedundancyCheck.getCrc32Checksum(new Buffer([0x00, 0x00, 0x00]));
        var expected = new Buffer([0xff, 0x41, 0xd9, 0x12]);
        Assert.equal(actual, expected, 'getCrc32Checksum complex 1');
    }

    async testGetCrc32ChecksumComplex2() {
        var actual = CyclicRedundancyCheck.getCrc32Checksum(new Buffer('शीर्षक'));
        var expected = new Buffer([0x17, 0xb8, 0xaf, 0xf1]);
        Assert.equal(actual, expected, 'getCrc32Checksum complex 2');
    }

        // Casts to buffer
        var actual = CyclicRedundancyCheck.getCrc32Checksum('शीर्षक');
        var expected = new Buffer([0x17, 0xb8, 0xaf, 0xf1]);
        Assert.equal(actual, expected, 'getCrc32Checksum casts to buffer if necessary');

        // Signed
        var actual = CyclicRedundancyCheck.getCrc32ChecksumSigned('ham sandwich');
        var expected = -1891873021;
        Assert.equal(actual, expected, 'getCrc32ChecksumSigned simple 1');

        // Unsigned
        var actual = CyclicRedundancyCheck.getCrc32ChecksumSigned('bear sandwich');
        var expected = 3711466352;
        Assert.equal(actual, expected, 'getCrc32ChecksumUnsigned simple 1');

        // Appending
        var pieces = [new Buffer('hey'), new Buffer(' '), new Buffer('sup'), new Buffer(' '), new Buffer('bros')];
        var actual = null;
        for(var i = 0; i < pieces.length; i++) {
            actual = CyclicRedundancyCheck.getCrc32ChecksumSigned(value, );
        });
        
            crc = crc32(input[i], crc);
        }
        var actual = CyclicRedundancyCheck.getCrc32ChecksumSigned('bear sandwich');
        var expected = new Buffer([0x47, 0xfa, 0x55, 0x70];
        Assert.equal(actual, expected, 'getCrc32ChecksumUnsigned simple 1');

        test('simple crc32 in append mode', function (t) {
            var input = ;
            var expected = );
            
            t.same(crc, expected);
            t.end();
            });
    }





test('can do signed in append mode', function (t) {
var input1 = 'ham';
var input2 = ' ';
var input3 = 'sandwich';
var expected = -1891873021;

var crc = crc32.signed(input1);
crc = crc32.signed(input2, crc);
crc = crc32.signed(input3, crc);

t.same(crc, expected);
t.end();
});

test('make sure crc32 can accept integers as first arg ', function (t) {
try {
t.same(crc32(0), new Buffer([0x00, 0x00, 0x00, 0x00]));
} catch (e) {
t.fail("should be able to accept integer");
} finally {
t.end();
}
});

test('make sure crc32 throws on bad input', function (t) {
try {
crc32({});
t.fail("should fail on garbage input");
} catch (e) {
t.ok("should pass");
} finally {
t.end();
}
});

test('can do unsigned in append mode', function (t) {
var input1 = 'bear san';
var input2 = 'dwich';
var expected = 3711466352;

var crc = crc32.unsigned(input1);
crc = crc32.unsigned(input2, crc);
t.same(crc, expected);
t.end();
});

}

// Export
export default CyclicRedundancyCheckTest;
