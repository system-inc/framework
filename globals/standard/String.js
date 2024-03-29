// Patch String, do not extend

// Instance methods

String.prototype.distance = function(string) {
	return String.distance(this, string);
}

String.prototype.append = function(string) {
   return this+string;
};

String.prototype.prepend = function(string) {
   return string+this;
};

String.prototype.empty = function() {
   return (this.length === 0 || !this.trim());
};

String.prototype.contains = function(stringOrRegularExpression, caseSensitive = false) {
	var count = 0;

	var regularExpression = null;
	if(RegularExpression.is(stringOrRegularExpression)) {
		regularExpression = stringOrRegularExpression;
	}
	else {
		var string = RegularExpression.escape(stringOrRegularExpression);

		if(caseSensitive) {
			regularExpression = new RegularExpression(string, 'g');
		}
		else {
			regularExpression = new RegularExpression(string, 'gi');
		}
	}

	count = (this.match(regularExpression) || []).length;

	return count;
};

String.prototype.count = String.prototype.contains;

String.prototype.uppercase = String.prototype.toUpperCase;

String.prototype.uppercaseFirstCharacter = function() {
	return this.capitalize();
};

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
};

String.prototype.lowercase = String.prototype.toLowerCase;

String.prototype.lowercaseFirstCharacter = function() {
	return this.charAt(0).toLowerCase() + this.slice(1);
};

String.prototype.isLowercase = function() {
	return this == this.lowercase();
};

String.prototype.isUppercase = function() {
	return this == this.uppercase();
};

String.prototype.trimLeft = function(characters = '\\s') {
	return this.replace(new RegExp('^['+characters+']+'), '');
};

String.prototype.trimRight = function(characters = '\\s') {
	return this.replace(new RegExp('['+characters+']+$'), '');
};

String.prototype.trim = function(characters) {
	return this.trimLeft(characters).trimRight(characters);
};

String.prototype.replaceStandard = String.prototype.replace;

String.prototype.replace = function(pattern, replacement, flags) {
	// Use standard replace if they are sending in a regex pattern or flags
	if(pattern instanceof RegularExpression || flags) {
		return this.replaceStandard(pattern, replacement, flags);
	}
	// Make replace behave like replaceAll by default
	else {
		return this.replaceStandard(new RegularExpression(RegularExpression.escape(pattern), 'g'), replacement);
	}
};

String.prototype.replaceFirst = function(pattern, replacement) {
	return this.replaceStandard(pattern, replacement);
};

String.prototype.replaceLast = function(pattern, replacement) {
	//console.log('replaceLast', 'pattern', pattern, 'replacement', replacement);
	var lastIndexOf = this.lastIndexOf(pattern);
	//console.log('lastIndexOf', lastIndexOf);

	if(lastIndexOf > -1) {
		return this.replaceSubstring(pattern, replacement, lastIndexOf);
	}
	else {
		return this;
	}
};

String.prototype.replaceSubstring = function(pattern, replacement = '', start = 0) {
	var length = pattern.length;

	var result = this.slice(0, start);
	result += replacement.substring(0, length);
	result += replacement.slice(length);
	result += this.slice(start + length);

	return result;
};

String.prototype.replaceRange = function(start, end, replacement) {
   return this.substring(0, start) + replacement + this.substring(end);
};

String.prototype.replaceCharacterAtIndex = function(index, character) {
	return this.substr(0, index) + character + this.substr(index+character.length);
};

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
};

String.prototype.toInteger = function() {
	return new Number(this).toInteger();
};

String.prototype.toTitleFromCamelCase = function() {
	var string = this.toDashes();
	string = string.replace('-', ' ');
	string = string.toTitle();

	return string;
};

String.prototype.toTitle = function() {
	var string = this.toLowerCase();
	var lowercaseWords = ['a', 'aboard', 'about', 'above', 'absent', 'across', 'after', 'against', 'along', 'alongside', 'amid', 'amidst', 'among', 'amongst', 'an', 'and', 'around', 'as', 'aslant', 'astride', 'at', 'athwart', 'atop', 'barring', 'before', 'behind', 'below', 'beneath', 'beside', 'besides', 'between', 'beyond', 'but', 'by', 'despite', 'down', 'during', 'except', 'failing', 'following', 'for', 'for', 'from', 'in', 'inside', 'into', 'like', 'mid', 'minus', 'near', 'next', 'nor', 'notwithstanding', 'of', 'off', 'on', 'onto', 'opposite', 'or', 'out', 'outside', 'over', 'past', 'per', 'plus', 'regarding', 'round', 'save', 'since', 'so', 'than', 'the', 'through', 'throughout', 'till', 'times', 'to', 'toward', 'towards', 'under', 'underneath', 'unlike', 'until', 'up', 'upon', 'via', 'vs.', 'when', 'with', 'within', 'without', 'worth', 'yet',];
	var uppercaseWords = ['qr', 'api', 'os'];
	var specialCaseWords = ['ios', 'ipad', 'iphone', 'ipod', 'imac'];
	var words = string.split(' ');

	var processedWords = [];
	words.each(function(index, word) {
		// Capitalize the first word or any word not explicitly in the lowercaseWords array
	    if(index == 0 || !lowercaseWords.contains(word)) {
	        word = word.capitalize(true);
	    }

	    // Uppercase any words explicitly in the uppercaseWords array
	    if(uppercaseWords.contains(word)) {
	        word = word.uppercase();
	    }

	    // Special case words have their second letter capitalized
	    if(specialCaseWords.contains(word)) {
	    	// iOS is a very special case where the third letter is capitalized as well
			if(word.lowercase() == 'ios') {
				word = 'iOS';
			}
			else {
		        word = word.lowercase();
		        word = word.replaceCharacterAtIndex(1, word[1].uppercase());
			}
	    }

	    processedWords.append(word);
	});

	string = processedWords.join(' ');

	return string;
};

String.prototype.toDashes = function() {
	var string;

	// If we are all caps then turn the whole string to lowercase
	if(this.isUppercase()) {
		string = this.lowercase();
	}
	// If we aren't all caps, just lowercase the first character
	else {
		string = this.lowercaseFirstCharacter();
	}

	// If we have a string with spaces 'This Is My String';
	if(string.contains(' ')) {
		string = string.replace(/\s+/g, '-');
	}
	// If we have a string with underscore 'This Is My String';
	else if(string.contains('_')) {
		string = string.replace(/_+/g, '-');
	}
	// Assume we have a string like 'ThisIsMyString' (no spaces)
	else {
		string = string.replace(/([A-Z])/g, function(match) {
			return '-'+match.toLowerCase();
		});
	}

	// Lowercase the entire string
	string = string.lowercase();

	string = string.replace("'", '');

	return string;
};

String.prototype.toCamelCase = function(uppercaseFirstCharacter) {
	var string = this.toDashes();

	if(string.contains('-')) {
		string = string.replace(/-(.)/g, function(match, group1) {
	        return group1.toUpperCase();
	    });
	}

	if(uppercaseFirstCharacter) {
		string = string.uppercaseFirstCharacter();
	}

	return string;
};

String.prototype.toSpaces = function() {
	var string = this.lowercaseFirstCharacter();

	// This is assuming we have a string like 'ThisIsMyString'
	// We should make this function intelligent and autodetect other types like 'this_is_my_string' and 'this is my string'
	string = string.replace(/([A-Z])/g, function(match) {
		//app.log(arguments);
		return ' '+match.toLowerCase();
	});

	return string;
};

String.prototype.toHtmlEntities = function() {
	return this.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
};

String.prototype.indefiniteArticle = function(capitalizeFirstCharacter) {
   var indefiniteArticle = null;
   var vowels = ['a', 'e', 'i', 'o', 'u'];

   if(vowels.contains(this[0].lowercase())) {
       indefiniteArticle = 'an';
   }
   else {
       indefiniteArticle = 'a';
   }
   if(capitalizeFirstCharacter) {
       indefiniteArticle = indefiniteArticle.uppercaseFirstCharacter();
   }

   return indefiniteArticle;
};

String.prototype.sizeInBytes = function() {
	var bytes = 0;
	for(var i = 0; i < this.length; i++) {
		var characterCode = this.characterCodeAt(i);

		// In accordance with http://en.wikipedia.org/wiki/UTF-8#Description
		bytes +=
			characterCode === false ? 0 :
			characterCode <= 0x007f ? 1 :
			characterCode <= 0x07FF ? 2 :
			characterCode <= 0xFFFF ? 3 :
			characterCode <= 0x1FFFFF ? 4 :
			characterCode <= 0x3FFFFFF ? 5 : 6;
	}

	return bytes;
};

String.prototype.characterAt = String.prototype.charAt;

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
};

String.prototype.reverse = function() {
	var regexSymbolWithCombiningMarks = /(<%= allExceptCombiningMarks %>)(<%= combiningMarks %>+)/g;
	var regexSurrogatePair = /([\uD800-\uDBFF])([\uDC00-\uDFFF])/g;

	// Deal with combining marks and astral symbols (surrogate pairs)
	var string = this
		// Swap symbols with their combining marks so the combining marks go first
		.replace(regexSymbolWithCombiningMarks, function($0, $1, $2) {
			// Reverse the combining marks so they will end up in the same order later on (after another round of reversing)
			return reverse($2) + $1;
		})
		// Swap high and low surrogates so the low surrogates go first
		.replace(regexSurrogatePair, '$2$1');

	// Step 2: reverse the code units in the string
	var result = '';
	var index = string.length;
	while(index--) {
		result += string.charAt(index);
	}

	return result;
};

String.prototype.reflect = function() {
	var stringLines = this.split("\n");

	var reflectedStringLines = [];

	stringLines.each(function(index, stringLine) {
		reflectedStringLines.append(stringLine.reverse());
	});

	var reflectedString = reflectedStringLines.join("\n");

	return reflectedString;
};

// Repeat a string count times
String.prototype.repeat = function(count) {
	var string = '';
	for(var i = 0; i < count; i++) {
		string += this;
	}
	return string;
}

String.prototype.toStream = function() {
	// Create a new stream
	var stream = new Node.Stream.Readable();

	// Add this string to the stream
	stream.append(this.toString());

	// Indicate end of stream
	stream.append(null);

	return stream;
};

String.prototype.toLines = function() {
	return this.split(/\r|\r\n|\n/g);
};

String.prototype.getLineCount = function() {
	return (this.match(/\r|\r\n|\n/g) || '').length + 1;
};

String.prototype.getCharacterCount = function(stripAnsiEscapeSequences = true) {
	// Strip ANSI escape sequences
	if(stripAnsiEscapeSequences) {
		return this.stripAnsiEscapeSequences().length;
	}
	else {
		return this.length;
	}
};

String.prototype.stripAnsiEscapeSequences = function stripAnsiEscapeSequences() {
	return this.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
};

String.prototype.splitOnFirst = function(stringToSplitOn) {
	let indexOfStringToSplitOn = this.indexOf(stringToSplitOn);

	let firstHalf = this.substring(0, indexOfStringToSplitOn);
	let secondHalf = this.substring(indexOfStringToSplitOn + stringToSplitOn.length);

	return [
		firstHalf,
		secondHalf,
	];
};

String.prototype.pluralize = function(count, suffix = 's') {
	var pluralizedString = this;

	if(count !== 1) {
		pluralizedString += suffix;
	}

	return pluralizedString;
};

// Static methods

String.is = function(value) {
	return typeof(value) == 'string' || value instanceof String;
};

String.distance = function(a, b) {
	if(a.length == 0) {
		return b.length;
	}
	if(b.length == 0) {
		return a.length;
	}

	// Swap to save some memory O(min(a,b)) instead of O(a)
	if(a.length > b.length) {
		var tmp = a;
		a = b;
		b = tmp;
	}

	var row = [];
	// init the row
	for(var i = 0; i <= a.length; i++) {
		row[i] = i;
	}

	// fill in the rest
	for(var i = 1; i <= b.length; i++) {
		var prev = i;
		for(var j = 1; j <= a.length; j++) {
			var val;
			if(b.charAt(i-1) == a.charAt(j-1)) {
				val = row[j-1]; // match
			}
			else {
				val = Math.min(
					row[j-1] + 1, // substitution
					prev + 1, // insertion
					row[j] + 1, // deletion
				);  
			}
			row[j - 1] = prev;
			prev = val;
		}
		row[a.length] = prev;
	}

	return row[a.length];
};

String.fromCharacterCode = String.fromCharCode;

// Newline
if(typeof Node !== 'undefined' && Node.OperatingSystem) {
	String.newline = Node.OperatingSystem.EOL;	
}
else {
	String.newline = "\n";
}

String.uniqueIdentifier = function(length = 16) {
	var uniqueIdentifier = '';

	var fourHexCharacters = function() {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	}

	for(var i = 0; i < length; i = i + 4) {
		uniqueIdentifier += fourHexCharacters();
	}

	uniqueIdentifier = uniqueIdentifier.substring(0, length);

	return uniqueIdentifier;
};

String.castToString = function(value) {
	if(!String.is(value)) {
		value = String(value);
	}

	return value;
};

String.random = function(length = 32, characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789') {
	var maxIndex = characters.length - 1;
	var string = '';

	for(var i = 0; i < length; i++) {
		string += characters[Number.random(0, maxIndex, 0)];
	}

	return string;
};

String.cryptographicRandom = async function(length = 32, characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789') {
	var maxIndex = characters.length - 1;
	var string = '';

	for(var i = 0; i < length; i++) {
		var cryptographicRandom = await Number.cryptographicRandom(0, maxIndex);
		string += characters[cryptographicRandom];
	}

	return string;
};
