// Dependencies
var HtmlElementEvent = Framework.require('system/html/events/html-element/HtmlElementEvent.js');

// Class
var KeyboardEvent = HtmlElementEvent.extend({

	// Keyboard keys down when the mouse event was emitted
	modifierKeysDown: {
		alt: null, // true if the alt key was down when the mouse event was emitted
		control: null, // true if the control key was down when the mouse event was emitted
		// meta is the Command key on macOS keyboards or Windows key on Windows keyboards
		meta: null, // true if the meta key was down when the mouse event was emitted
		shift: null, // true if the shift key was down when the mouse event was emitted
	},

	// The key
	key: null,

	// The location of the key on the keyboard
	keyLocation: null,

	// If the key is being held down
	keyHeldDown: null,

});

// Static methods

KeyboardEvent.is = function(value) {
	return Class.isInstance(value, KeyboardEvent);
};

KeyboardEvent.createEventsFromDomEvent = function(domKeyboardEvent, emitter, eventPattern) {
	Console.standardLog('KeyboardEvent.createEventsFromDomEvent arguments', domKeyboardEvent.type, arguments);

	var events = [];

	// Use this for identifying which events to create
	var keyboardEventWithoutIdentifier = KeyboardEvent.createFromDomEvent(domKeyboardEvent, emitter, null);

	// "keyup" to "up", "keydown" to "down", "keypress" to "press"
	var eventType = domKeyboardEvent.type.replace('key', '');

	// The identifier for the event
	var eventIdentifier = 'keyboard.key.'+keyboardEventWithoutIdentifier.key+'.'+eventType;

	// Set the identifier
	keyboardEventWithoutIdentifier.identifier = eventIdentifier;

	// For key up events
	if(eventType == 'up') {
		// Keys that do not normally emit press events for which we need to manually emit one
		if(
			keyboardEventWithoutIdentifier.key == 'alt' ||
			keyboardEventWithoutIdentifier.key == 'control' ||
			keyboardEventWithoutIdentifier.key == 'meta' ||
			keyboardEventWithoutIdentifier.key == 'shift' ||
			keyboardEventWithoutIdentifier.key == 'contextMenu' ||
			keyboardEventWithoutIdentifier.key == 'backspace' ||
			keyboardEventWithoutIdentifier.key == 'up' ||
			keyboardEventWithoutIdentifier.key == 'down' ||
			keyboardEventWithoutIdentifier.key == 'left' ||
			keyboardEventWithoutIdentifier.key == 'right' ||
			keyboardEventWithoutIdentifier.key == 'delete' ||
			keyboardEventWithoutIdentifier.key == 'insert'
		) {
			eventIdentifier = eventIdentifier.replaceLast('.up', '.press');
			events.append(KeyboardEvent.createFromDomEvent(domKeyboardEvent, emitter, eventIdentifier));
		}
	}

	// Add the event
	events.append(keyboardEventWithoutIdentifier);

	// Create additional events including the location of the key, e.g., "keyboard.key.left.shift.up"
	if(
		keyboardEventWithoutIdentifier.keyLocation == 'left' ||
		keyboardEventWithoutIdentifier.keyLocation == 'right' ||
		keyboardEventWithoutIdentifier.keyLocation == 'numericKeypad'
	) {
		eventIdentifier = 'keyboard.key.'+keyboardEventWithoutIdentifier.keyLocation+'.'+keyboardEventWithoutIdentifier.key+'.'+eventType;
		events.append(KeyboardEvent.createFromDomEvent(domKeyboardEvent, emitter, eventIdentifier));
	}

	//Console.standardLog('KeyboardEvent.createEventsFromDomEvent events', events);

	return events;
};

KeyboardEvent.createFromDomEvent = function(domKeyboardEvent, emitter, identifier, data, options) {
	var keyboardEvent = new KeyboardEvent(emitter, identifier, data, options);

	keyboardEvent.modifierKeysDown.alt = domKeyboardEvent.altKey;
	keyboardEvent.modifierKeysDown.control = domKeyboardEvent.ctrlKey;
	keyboardEvent.modifierKeysDown.meta = domKeyboardEvent.metaKey;
	keyboardEvent.modifierKeysDown.shift = domKeyboardEvent.shiftKey;

	// Get the key
	var key = domKeyboardEvent.key; // "a"

	// If there is no key but there is a keyIdentifier which is not a unicode character
	if(!key && domKeyboardEvent.keyIdentifier && !domKeyboardEvent.keyIdentifier.startsWith('U+')) {
		key = domKeyboardEvent.keyIdentifier;
	}
	// Sometimes domKeyboardEvent.key isn't populated, so we can get it from domKeyboardEvent.keyCode
	if(!key && domKeyboardEvent.keyCode) {
		key = String.fromCharacterCode(domKeyboardEvent.keyCode);
	}
	// Sometimes domKeyboardEvent.key isn't populated, so we can get it from domKeyboardEvent.charCode
	else if(!key && domKeyboardEvent.charCode) {
		key = String.fromCharacterCode(domKeyboardEvent.charCode);
	}
	else if(!key && domKeyboardEvent.keyIdentifier) {
		key = domKeyboardEvent.keyIdentifier;
	}

	Console.standardWarn('key is', key, 'for', domKeyboardEvent.keyCode);

	// Special cases
	if(domKeyboardEvent.keyCode == 8) {
		key = 'backspace';
	}
	else if(domKeyboardEvent.keyIdentifier == 'U+0020') {
		key = 'space';
	}
	else if(domKeyboardEvent.keyIdentifier == 'U+007F') {
		key = 'delete';
	}

	Console.standardWarn('key is now', key, 'from', domKeyboardEvent.keyCode);

	// Rename space
	if(key == ' ') {
		key = 'space';
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

		// "arrowup" to "up", etc.
		key = key.replace('arrow', '');
	}

	// Set the key property
	keyboardEvent.key = key;

	keyboardEvent.keyLocation = null;
	if(domKeyboardEvent.location != undefined) {
		if(domKeyboardEvent.location == 0) {
			keyboardEvent.keyLocation = 'standard';
		}
		else if(domKeyboardEvent.location == 1) {
			keyboardEvent.keyLocation = 'left';
		}
		else if(domKeyboardEvent.location == 2) {
			keyboardEvent.keyLocation = 'right';
		}
		else if(domKeyboardEvent.location == 3) {
			keyboardEvent.keyLocation = 'numericKeypad';
		}
		else if(domKeyboardEvent.location == 4) {
			keyboardEvent.keyLocation = 'mobileDevice';
		}
		else if(domKeyboardEvent.location == 5) {
			keyboardEvent.keyLocation = 'controllerOnMobileDevice';
		}
	}

	if(domKeyboardEvent.repeat != undefined) {
		keyboardEvent.keyHeldDown = domKeyboardEvent.repeat;
	}

	return keyboardEvent;
};

// Export
module.exports = KeyboardEvent;