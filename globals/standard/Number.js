// Dependencies
import { Cryptography } from '@framework/system/cryptography/Cryptography.js';

// Instance methods

Number.prototype.isInteger = function() {
	return Number.isInteger(this);
};

Number.prototype.toInteger = function() {
	return Number.toInteger(this);
};

Number.prototype.addCommas = function() {
	return Number.addCommas(this);
};

// Static methods

Number.is = function(value) {
    if(isNaN(value)) {
        return false;
    }

	return typeof(value) == 'number' || value instanceof Number;
};

Number.isHexadecimalString = function(value) {
    var integer = parseInt(value, 16);
    return (integer.toString(16) === value.toLowerCase());
};

Number.from = function(value) {
    let number = null;

    number = Number(value);

    return number;
};

Number.isInteger = function(value) {
	return /^\+?-?(0|[1-9]\d*)$/.test(value);
};

Number.toInteger = function(value) {
	if(!value) {
		return 0;
	}

	return parseInt(value, 10);
};

Number.toFloat = function(value) {
	if(!value) {
		return 0;
	}

	return parseFloat(value);
};

Number.toPercentage = function(number, precision = 2) {
	return Number.round(number * 100, 2)+'%';
}

Number.precision = function(number) {
	if(!isFinite(number)) {
		return 0;
	}

	var e = 1;
	var precision = 0;
	while(Math.round(number * e) / e !== number) {
		e *= 10;
		precision++;
	}

	return precision;
};

Number.round = function(number, precision = 0) {
	number = Number.toFloat(number);
	number = number.toFixed(precision);

	// Make 0 precision numbers integers
	if(precision == 0) {
		number = Number.toInteger(number);
	}

	return number;
};

Number.addCommas = function(number = null) {
	// Return an empty string if the number is not 0
	if(number !== 0 && !number) {
		return '';
	}

	var parts = number.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return parts.join('.');
};

Number.hexadecimalToInteger = function(hexadecimal) {
    let integer = null;

    // If the value is a string
    if(String.is(hexadecimal)) {
        integer = parseInt(hexadecimal, 16);
    }
    // If the value is actually hexadecimal
    else {
        integer = parseInt(hexadecimal, 10);
    }

    return integer;
}

Number.hexadecimalStringToSignedInteger = function(hexadecimalString) {
    if(hexadecimalString.length % 2 != 0) {
        hexadecimalString = '0' + hexadecimalString;
    }

    let integer = Number.hexadecimalToInteger(hexadecimalString);
    
    let maximumValue = Math.pow(2, hexadecimalString.length / 2 * 8);

    if(integer > maximumValue / 2 - 1) {
        integer = integer - maximumValue
    }

    return integer;
}

Number.toMoney = function(number, precision = 2, showPositiveDelta = false) {
    number = Number.toFloat(number);

	var formatted;
	if(number < 0) {
        number = Math.abs(number);

		formatted = '-$'+Number.addCommas(number.toFixed(precision));
	}
	else {
		formatted = '$'+Number.addCommas(number.toFixed(precision));

        if(showPositiveDelta) {
            formatted = '+'+formatted;
        }
	}

	return formatted;
};

Number.toEnglish = function(number) {
    var string = number.toString();

    // Handle decimals
    var stringArray = string.split('.');
    var decimals = '';
    if(stringArray.length == 2) {
        string = stringArray[0];

        // Loop through each decimal
        stringArray[1].each(function(index, decimal) {
            decimals += Number.toEnglish(decimal)+' ';
        });

        decimals = decimals.trim();
    }

    // Handle zero
    if(parseInt(string) === 0) {
        return 'zero';
    }

    // Array of units as words
    var units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];

    // Array of tens as words
    var tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    // Array of scales as words
    var scales = [ '', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion', 'sextillion', 'septillion', 'octillion', 'nonillion', 'decillion', 'undecillion', 'duodecillion', 'tredecillion', 'quatttuor-decillion', 'quindecillion', 'sexdecillion', 'septen-decillion', 'octodecillion', 'novemdecillion', 'vigintillion', 'centillion'];
   
    var and = 'and';

    // Split user argument into 3 digit chunks from right to left
    var start = string.length;
    var end = null;
    var chunks = [];
    while(start > 0) {
        end = start;
        chunks.push(string.slice((start = Math.max(0, start - 3)), end));
    }

    // Check if function has enough scale words to be able to stringify the user argument
    var chunksLength = chunks.length;
    if(chunksLength > scales.length) {
        return '';
    }

    // Stringify each integer in each chunk
    var word = null;
    var words = [];
    for(var i = 0; i < chunksLength; i++) {
        var chunk = parseInt(chunks[i]);

        if(chunk) {
            // Split chunk into array of individual integers
            var integers = chunks[i].split('').reverse().map(parseFloat);

            // If tens integer is 1, i.e. 10, then add 10 to units integer
            if(integers[1] === 1) {
                integers[0] += 10;
            }

            // Add scale word if chunk is not zero and array item exists
            if((word = scales[i])) {
                words.push(word);
            }

            // Add unit word if array item exists
            if((word = units[integers[0]])) {
                words.push(word);
            }

            // Add tens word if array item exists
            if((word = tens[integers[1]])) {
                words.push(word);
            }

            // Add 'and' string after units or tens integer if:
            if(integers[0] || integers[1]) {

                // Chunk has a hundreds integer or chunk is the first of multiple chunks
                if(integers[2] || ! i && chunksLength) {
                    words.push(and);
                }

            }

            // Add hundreds word if array item exists
            if((word = units[integers[2]])) {
                words.push(word + ' hundred' );
            }
        }
    }

    // Remove last and
    if(words.last() == 'and') {
    	words.pop();
    }

    var words = words.reverse().join(' ');

    if(decimals != '') {
        words += ' point '+decimals;
    }

    return words;
};

// Minimum and maximum are both inclusive
Number.random = function(minimum = 0, maximum = 1, precision = 16) {
	// toFixed digits argument must be between 0 and 20
	if(precision > 20) {
		precision = 20;
	}
	if(precision < 0) {
		precision = 0;
	}

	var random = Math.random() * (maximum - minimum) + minimum;

    return Number(random.toFixed(precision));
};

// Minimum and maximum are both inclusive
Number.cryptographicRandom = async function(minimum = 0, maximum = 9007199254740992, precision = 0) {
	// toFixed digits argument must be between 0 and 20
	if(precision > 20) {
		precision = 20;
	}
	if(precision < 0) {
		precision = 0;
	}

	var cryptographicRandom = await Cryptography.random();

	var random = cryptographicRandom * (maximum - minimum) + minimum;

    return Number(random.toFixed(precision));
};

// Constrain a number to a range
Number.constrain = function(number, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, number));
}
