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

KeyboardEvent.createEventsFromDomEvent = function(domKeyboardEvent, emitter, data, options) {
	//Console.standardLog('KeyboardEvent.createEventsFromDomEvent', domKeyboardEvent.type, arguments);

	var events = [];

	// Use this for identifying which events to create
	var keyboardEventWithoutIdentifier = KeyboardEvent.createFromDomEvent(domKeyboardEvent, emitter, null, data, options);

	// "keyup" to "up", "keydown" to "down", "keypress" to "press"
	var eventType = domKeyboardEvent.type.replace('key', '');

	// The identifier for the event
	var eventIdentifier = 'keyboard.key.'+keyboardEventWithoutIdentifier.key+'.'+eventType;

	// Set the identifier
	keyboardEventWithoutIdentifier.identifier = eventIdentifier;

	// Add the event
	events.append(keyboardEventWithoutIdentifier);

	// For key up events
	if(eventType == 'up') {
		if(
			// alt, control, meta, and shift also fire "press" events
			keyboardEventWithoutIdentifier.key == 'alt' ||
			keyboardEventWithoutIdentifier.key == 'control' ||
			keyboardEventWithoutIdentifier.key == 'meta' ||
			keyboardEventWithoutIdentifier.key == 'shift' ||

			keyboardEventWithoutIdentifier.key == 'backspace' ||

			// up, down, left, and right also fire "press" events
			keyboardEventWithoutIdentifier.key == 'up' ||
			keyboardEventWithoutIdentifier.key == 'down' ||
			keyboardEventWithoutIdentifier.key == 'left' ||
			keyboardEventWithoutIdentifier.key == 'right'
		) {
			eventIdentifier = eventIdentifier.replaceLast('.up', '.press');
			events.append(KeyboardEvent.createFromDomEvent(domKeyboardEvent, emitter, eventIdentifier, data, options));
		}
	}

	// Create additional events including the location of the key, e.g., "keyboard.key.left.shift.up"
	if(
		keyboardEventWithoutIdentifier.keyLocation == 'left' ||
		keyboardEventWithoutIdentifier.keyLocation == 'right' ||
		keyboardEventWithoutIdentifier.keyLocation == 'numericKeypad'
	) {
		eventIdentifier = 'keyboard.key.'+keyboardEventWithoutIdentifier.keyLocation+'.'+keyboardEventWithoutIdentifier.key+'.'+eventType;
		events.append(KeyboardEvent.createFromDomEvent(domKeyboardEvent, emitter, eventIdentifier, data, options));
	}

	//Console.standardLog('events', events);

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
	
	// Rename the key if neccesary
	if(key && String.is(key) && key.length > 1) {
		// "Shift" to "shift", "Ctrl" to "ctrl", etc.
		key = key.lowercase();

		// 
		if(key == 'ctrl') {
			key = 'control';
		}

		// "arrowup" to "up", etc.
		key = key.replace('arrow', '');
	}

	// Sometimes domKeyboardEvent.key isn't populated, so we can get it from domKeyboardEvent.keyCode
	if(!key && domKeyboardEvent.keyCode) {
		key = String.fromCharacterCode(domKeyboardEvent.keyCode);
	}

	// Sometimes domKeyboardEvent.key isn't populated, so we can get it from domKeyboardEvent.charCode
	if(!key && domKeyboardEvent.charCode) {
		key = String.fromCharacterCode(domKeyboardEvent.charCode);
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