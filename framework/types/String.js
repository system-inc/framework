String.is = function(value) {
	return typeof value == 'string';
}

String.prototype.contains = function(string, caseSensitive) {
	caseSensitive = caseSensitive === false ? false : true;
	var contains = false;

	if(!caseSensitive) {
		var regularExpression = new RegExp(string, 'i');
		contains = regularExpression.test(this);
	}
	else {
		contains = this.indexOf(string) != -1;
	}

	return contains;
}

String.prototype.capitalize = function(capitalizeEveryWord, lowerCaseAllWordsAfterFirstWord) {
	if(capitalizeEveryWord) {
		return this.split(' ').map(function(currentValue, index, array) {
			return currentValue.capitalize(lowerCaseAllWordsAfterFirstWord);
		}, this)
		.join(' ').split('-').map(function(currentValue, index, array) {
			return currentValue.capitalize(false);
		}, this)
		.join('-');
	}
	else {
		return lowerCaseAllWordsAfterFirstWord ? this.charAt(0).toUpperCase() + this.slice(1).toLowerCase() : this.charAt(0).toUpperCase() + this.slice(1);
	}
}

String.prototype.upperCaseFirstCharacter = function() {
	return this.capitalize();
}

String.prototype.lowerCaseFirstCharacter = function() {
	return this.charAt(0).toLowerCase() + this.slice(1);
}

String.prototype.replaceStandard = String.prototype.replace;

String.prototype.replaceFirst = function(pattern, replacement) {
	return this.replaceStandard(pattern, replacement);
}

String.prototype.replaceLast = function(pattern, replacement) {
	var lastIndexOf = this.lastIndexOf(pattern);

	if(lastIndexOf > -1) {
		return this.replaceSubstring(pattern, replacement, lastIndexOf, pattern.length);
	}
	else {
		return this;
	}
}

String.prototype.replaceSubstring = function(pattern, replacement, start, length) {
	length = length !== undefined ? length : this.length;

	var result = this.slice(0, start);
	result += replacement.substring(0, length);
	result += replacement.slice(length);
	result += this.slice(start + length);

	return result;
}

String.prototype.replace = function(pattern, replacement, flags) {
	// Use standard replace if they are sending in a regex pattern or flags
	if(pattern instanceof RegExp || flags) {
		return this.replaceStandard(pattern, replacement, flags);	
	}
	// Make replace behave like replaceAll by default
	else {
		return this.replaceStandard(new RegExp(pattern, 'g'), replacement);	
	}
}

String.prototype.toDashes = function() {
	var result = this.lowerCaseFirstCharacter();

	// This is assuming we have a string like 'ThisIsMyString'
	// We should make this function intelligent and autodetect other types like 'this_is_my_string' and 'this is my string'
	result = result.replace(/([A-Z])/g, function(match) {
		//Log.log(arguments);
		return '-'+match.toLowerCase();
	});

	return result;
}

String.prototype.toSpaces = function() {
	var result = this.lowerCaseFirstCharacter();

	// This is assuming we have a string like 'ThisIsMyString'
	// We should make this function intelligent and autodetect other types like 'this_is_my_string' and 'this is my string'
	result = result.replace(/([A-Z])/g, function(match) {
		//Log.log(arguments);
		return ' '+match.toLowerCase();
	});

	return result;
}

String.prototype.toNumber = function() {
	return Number(this);
}

String.prototype.isJson = function() {
	var isJson = false;

	try {
        var object = JSON.parse(this);

        // Handle non-exception-throwing cases:
        // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
        // but JSON.parse(null) returns 'null', and typeof null === "object", so we must check for that, too.
        if(object && typeof object === "object" && object !== null) {
            isJson = true;
        }
    }
    catch(exception) {

    }

    return isJson;
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