String.is = function(value) {
	return typeof(value) == 'string' || value instanceof String;
}

String.prototype.empty = function() {
    return (this.length === 0 || !this.trim());
};

String.prototype.contains = function(string, caseSensitive) {
	caseSensitive = caseSensitive === undefined ? false : caseSensitive;
	var count = 0;

	if(caseSensitive) {
		count = (this.match(new RegularExpression(string, 'g')) || []).length
	}
	else {
		count = (this.match(new RegularExpression(string, 'gi')) || []).length
	}

	return count;
}

String.prototype.count = String.prototype.contains;

String.prototype.uppercase = String.prototype.toUpperCase;

String.prototype.uppercaseFirstCharacter = function() {
	return this.capitalize();
}

String.prototype.capitalize = function(capitalizeEveryWord, lowercaseAllWordsAfterFirstWord) {
	if(capitalizeEveryWord) {
		return this.split(' ').map(function(currentValue, index, array) {
			return currentValue.capitalize(lowercaseAllWordsAfterFirstWord);
		}, this)
		.join(' ').split('-').map(function(currentValue, index, array) {
			return currentValue.capitalize(false);
		}, this)
		.join('-');
	}
	else {
		return lowercaseAllWordsAfterFirstWord ? this.charAt(0).toUpperCase() + this.slice(1).toLowerCase() : this.charAt(0).toUpperCase() + this.slice(1);
	}
}

String.prototype.lowercase = String.prototype.toLowerCase;

String.prototype.lowercaseFirstCharacter = function() {
	return this.charAt(0).toLowerCase() + this.slice(1);
}

String.prototype.replaceStandard = String.prototype.replace;

String.prototype.replace = function(pattern, replacement, flags) {
	// Use standard replace if they are sending in a regex pattern or flags
	if(pattern instanceof RegularExpression || flags) {
		return this.replaceStandard(pattern, replacement, flags);	
	}
	// Make replace behave like replaceAll by default
	else {
		return this.replaceStandard(new RegularExpression(pattern, 'g'), replacement);	
	}
}

String.prototype.replaceFirst = function(pattern, replacement) {
	return this.replaceStandard(pattern, replacement);
}

String.prototype.replaceLast = function(pattern, replacement) {
	var lastIndexOf = this.lastIndexOf(pattern);

	if(lastIndexOf > -1) {
		return this.replaceSubstring(pattern, replacement, lastIndexOf);
	}
	else {
		return this;
	}
}

String.prototype.replaceSubstring = function(pattern, replacement, start) {
	length = pattern.length;

	var result = this.slice(0, start);
	result += replacement.substring(0, length);
	result += replacement.slice(length);
	result += this.slice(start + length);

	return result;
}

String.prototype.replaceRange = function(start, end, replacement) {
    return this.substring(0, start) + replacement + this.substring(end);
}

String.prototype.insert = function(index, string) {
    if(index > 0) {
        return this.substring(0, index) + string + this.substring(index, this.length);
    }
    else {
        return string + this;
    }
};

String.prototype.toNumber = function() {
	return Number(this);
}

String.prototype.toInteger = function() {
	return new Number(this).toInteger();
}

String.prototype.toDashes = function() {
	// Just lowercase the first character for now
	var result = this.lowercaseFirstCharacter();

	// If we have a string with spaces 'This Is My String';
	if(result.contains(' ')) {
		result = result.replace(/\s+/g, '-');
	}
	// If we have a string with underscore 'This Is My String';
	else if(result.contains('_')) {
		result = result.replace(/_+/g, '-');
	}
	// Assume we have a string like 'ThisIsMyString' (no spaces)
	else {
		result = result.replace(/([A-Z])/g, function(match) {
			return '-'+match.toLowerCase();
		});
	}

	// Lowercase the entire result
	result = result.lowercase();

	return result;
}

String.prototype.toSpaces = function() {
	var result = this.lowercaseFirstCharacter();

	// This is assuming we have a string like 'ThisIsMyString'
	// We should make this function intelligent and autodetect other types like 'this_is_my_string' and 'this is my string'
	result = result.replace(/([A-Z])/g, function(match) {
		//Console.out(arguments);
		return ' '+match.toLowerCase();
	});

	return result;
}

String.random = function(length, characters) {
	length = length === undefined ? 32 : length;
	characters = characters === undefined ? 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' : characters;

	var maxIndex = characters.length - 1;
	var string = '';

	for(var i = 0; i < length; i++) {
		string += characters[Number.random(0, maxIndex)];
	}

	return string;
}

String.cryptographicRandom = function*(length, characters) {
	length = length === undefined ? 32 : length;
	characters = characters === undefined ? 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' : characters;

	var maxIndex = characters.length - 1;
	var string = '';

	for(var i = 0; i < length; i++) {
		var cryptographicRandom = yield Number.cryptographicRandom(0, maxIndex);
		string += characters[cryptographicRandom];
	}

	return string;
}.toPromise();

String.prototype.sizeInBytes = function() {
	var bytes = 0;
	for(var i = 0; i < this.length; i++) {
		var c = this.characterCodeAt(i);
		
		// In accordance with http://en.wikipedia.org/wiki/UTF-8#Description
		bytes +=
			c === false ? 0 :
			c <= 0x007f ? 1 :
			c <= 0x07FF ? 2 :
			c <= 0xFFFF ? 3 :
			c <= 0x1FFFFF ? 4 :
			c <= 0x3FFFFFF ? 5 : 6;
	}

	return bytes;
}

String.prototype.characterCodeAt = function(index) {
	// '\uD800\uDC00'.characterCodeAt(0); // 65536
	// '\uD800\uDC00'.characterCodeAt(1); // false
	index = index || 0;
	var code = this.charCodeAt(index);
	var hi, low;

	if(0xD800 <= code && code <= 0xDBFF) { // High surrogate (could change last hex to 0xDB7F to treat high private surrogates as single characters)
		hi = code;
		low = this.charCodeAt(index + 1);
		
		if(isNaN(low)) {
			throw new Error('High surrogate not followed by low surrogate.');
		}
		
		return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;
	}

	if (0xDC00 <= code && code <= 0xDFFF) { // Low surrogate
		return false;
	}

	return code;
}