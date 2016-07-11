// Class
var Keyboard = Class.extend({
	
});

// Static properties

Keyboard.characterCodeMap = {
	//1: 'a',
	//2: 'b',
	//3: 'c',
	//4: 'd',
	//5: 'e',
	//6: 'f',
	//7: 'g',
	//8: 'h',
	//9: 'i',
	//10: 'j',
	//11: 'k',
	//12: 'l', // Clear
	//13: 'm',
	//14: 'n',
	//15: 'o',
	//16: 'p', // Shift
	//17: 'q', // Control
	//18: 'r', // Alt
	//19: 's',
	//20: 't',
	//21: 'u',
	//22: 'v',
	//23: 'w',
	//24: 'x',
	//25: 'y',
	//26: 'z',
	//27: 'leftBracket',
	//28: 'backslash',
	//29: 'rightBracket',
	//30: 'caret',
	//31: 'minus',
	//259: '@',

    8: 'backspace',
    9: 'tab',
    13: 'enter',
    16: 'shift',
    17: 'control',
    18: 'alt',
    19: 'pause',
    20: 'capsLock',
    27: 'escape',
    33: 'pageUp',
    34: 'pageDown',
    35: 'end',
    36: 'home',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    45: 'insert',
    46: 'delete',
};

// Static methods

Keyboard.getKeyFromCharacterCodeAndModifiers = function(characterCode, altModifier, controlModifier, metaModifier, shiftModifier) {
	// Set a variable for the key we will return
	var key = String.fromCharacterCode(characterCode);

	// Determine if the key is undisplayable
	var characterIsUndisplayable = /[\x00-\x08\x0E-\x1F\x80-\xFF]/.test(key);

	// If the key is displayable, get the string for the character code
	if(characterIsUndisplayable) {
		key = Keyboard.characterCodeMap[characterCode];

		if(key === undefined) {
			key = 'undisplayable';	
		}
	}
	else {
		// Handle the shift modifier
		if(shiftModifier) {
			key = key.uppercase();
		}
		else {
			key = key.lowercase();
		}
	}

	return key;
	

	// Get the key
	var key = domEvent.key; // "a"

	// Handle special characters which are issued when modifier keys are held down
	var specialCharacterCodeMap = {
		1: 'a',
		2: 'b',
		3: 'c',
		4: 'd',
		5: 'e',
		6: 'f',
		7: 'g',
		8: 'h',
		9: 'i',
		10: 'j',
		11: 'k',
		12: 'l', // Clear
		13: 'm',
		14: 'n',
		15: 'o',
		16: 'p', // Shift
		17: 'q', // Control
		18: 'r', // Alt
		19: 's',
		20: 't',
		21: 'u',
		22: 'v',
		23: 'w',
		24: 'x',
		25: 'y',
		26: 'z',
		27: 'leftBracket',
		28: 'backslash',
		29: 'rightBracket',
		30: 'caret',
		31: 'minus',
		259: '@',
	};
	var characterForSpecialCharacter = specialCharacterCodeMap[domEvent.keyCode];
	if(characterForSpecialCharacter && domEvent.code.startsWith('Key')) {
		key = characterForSpecialCharacter;
	}

	//Console.log('1. key', key, 'domEvent.keyIdentifier', domEvent.keyIdentifier);

	// If there is no key but there is a keyIdentifier which is not a unicode character
	//if(!key && domEvent.keyIdentifier && !domEvent.keyIdentifier.startsWith('U+')) {
	if(!key && domEvent.keyIdentifier) {
		key = domEvent.keyIdentifier;
	}

	//Console.log('2. key', key, 'domEvent.keyIdentifier', domEvent.keyIdentifier);

	// Sometimes domEvent.key isn't populated, so we can get it from domEvent.keyCode
	if(!key && domEvent.keyCode) {
		key = String.fromCharacterCode(domEvent.keyCode);
	}
	// Sometimes domEvent.key isn't populated, so we can get it from domEvent.charCode
	else if(!key && domEvent.charCode) {
		key = String.fromCharacterCode(domEvent.charCode);
	}
	else if(!key && domEvent.keyIdentifier) {
		key = domEvent.keyIdentifier;
	}

	//Console.log('3. key', key, 'domEvent.keyIdentifier', domEvent.keyIdentifier);

	//Console.standardWarn('key is', key, 'for', domEvent.keyCode);

	// Special cases
	if(domEvent.keyCode == 8) {
		key = 'backspace';
	}
	else if(domEvent.keyIdentifier == 'U+0020') {
		key = 'space';
	}
	else if(domEvent.keyIdentifier == 'U+007F') {
		if(domEvent.code == 'Period') {
			key = 'period';
		}
		else {
			key = 'delete';	
		}
	}

	//Console.standardWarn('key is now', key, 'from', domEvent.keyCode);

	// Rename keys
	if(key == ' ') {
		key = 'space';
	}
	else if(key == ',') {
		key = 'comma';
	}
	else if(key == '.') {
		key = 'period';
	}
	else if(key == '/') {
		key = 'forwardSlash';
	}
	else if(key == '/') {
		key = 'forwardSlash';
	}
	else if(key == '\\') {
		key = 'backslash';
	}
	else if(key == '[') {
		key = 'leftBracket';
	}
	else if(key == ']') {
		key = 'rightBracket';
	}
	else if(key == ';') {
		key = 'semicolon';
	}
	else if(key == '\'') {
		key = 'apostrophe';
	}
	else if(key == '|') {
		key = 'pipe';
	}
	else if(key == '-') {
		key = 'minus';
	}
	else if(key == '+') {
		key = 'plus';
	}
	else if(key == '<') {
		key = 'lessThan';
	}
	else if(key == '<') {
		key = 'moreThan';
	}
	else if(key == '<') {
		key = 'moreThan';
	}
	else if(key == '?') {
		key = 'questionMark';
	}
	// Rename the key if neccesary
	else if(key && String.is(key) && key.length > 1) {
		// "Shift" to "shift", "Ctrl" to "ctrl", etc.
		key = key.lowercase();

		// Rename keys
		if(key == 'ctrl') {
			key = 'control';
		}
		else if(key == 'contextmenu') {
			key = 'contextMenu';
		}
		else if(key == 'win') {
			key = 'meta';
		}

		// Replace meta with either windows or command
		if(key == 'meta') {
			if(Project.onWindows()) {
				key = 'windows';
			}
			else if(Project.onMacOs()) {
				key = 'command';
			}
		}

		// "arrowup" to "up", etc.
		key = key.replace('arrow', '');
	}
};

// Export
module.exports = Keyboard;