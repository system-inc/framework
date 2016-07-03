// Dependencies
var HtmlEvent = Framework.require('system/html/events/HtmlEvent.js');

// Class
var KeyboardEvent = HtmlEvent.extend({

	// Keyboard keys down when the mouse event was emitted
	keyboardKeysDown: {
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
		// alt, control, meta, and shift also fire "press" events
		if(
			keyboardEventWithoutIdentifier.key == 'alt' ||
			keyboardEventWithoutIdentifier.key == 'control' ||
			keyboardEventWithoutIdentifier.key == 'meta' ||
			keyboardEventWithoutIdentifier.key == 'shift'
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

	keyboardEvent.keyboardKeysDown.alt = domKeyboardEvent.altKey;
	keyboardEvent.keyboardKeysDown.control = domKeyboardEvent.ctrlKey;
	keyboardEvent.keyboardKeysDown.meta = domKeyboardEvent.metaKey;
	keyboardEvent.keyboardKeysDown.shift = domKeyboardEvent.shiftKey;

	// Get the key
	var key = domKeyboardEvent.key; // "a"
	
	// "Shift" to "shift", "Control" to "control", etc.
	if(key && String.is(key) && key.length > 1) {
		key = key.lowercase();

		if(key == 'ctrl') {
			key = 'control';
		}
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