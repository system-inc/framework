// Dependencies
var HtmlEvent = Framework.require('system/html/events/HtmlEvent.js');

// Class
var KeyboardEvent = HtmlEvent.extend({

	// Keyboard keys down when the mouse event was emitted
	keyboardKeysDown: {
		alt: null, // true if the alt key was down when the mouse event was emitted
		control: null, // true if the control key was down when the mouse event was emitted
		meta: null, // true if the meta key was down when the mouse event was emitted
		shift: null, // true if the shift key was down when the mouse event was emitted
	},

});

// Static methods

KeyboardEvent.is = function(value) {
	return Class.isInstance(value, KeyboardEvent);
};

KeyboardEvent.createEventsFromDomEvent = function(domKeyboardEvent, emitter, data, options) {
	Console.standardLog('KeyboardEvent.createEventsFromDomEvent', domKeyboardEvent.type, arguments);

	var events = [];

	var keyIdentifier = domKeyboardEvent.key;
	// "Shift" to "shift"
	if(keyIdentifier.length > 1) {
		keyIdentifier = keyIdentifier.lowercase();

		if(keyIdentifier == 'ctrl') {
			keyIdentifier = 'control';
		}
	}

	// "keyup" to "up"
	var eventType = domKeyboardEvent.type.replace('key', '');

	// Use this for identifying which events to create
	var keyboardEvent = KeyboardEvent.createFromDomEvent(domKeyboardEvent, emitter, 'keyboard.key.'+keyIdentifier+'.'+eventType, data, options);
	events.append(keyboardEvent);

	//Console.standardLog('events', events);

	return events;
};

KeyboardEvent.createFromDomEvent = function(domKeyboardEvent, emitter, identifier, data, options) {
	var keyboardEvent = new KeyboardEvent(emitter, identifier, data, options);

	keyboardEvent.keyboardKeysDown.alt = domKeyboardEvent.altKey;
	keyboardEvent.keyboardKeysDown.control = domKeyboardEvent.ctrlKey;
	keyboardEvent.keyboardKeysDown.meta = domKeyboardEvent.metaKey;
	keyboardEvent.keyboardKeysDown.shift = domKeyboardEvent.shiftKey;

	domKeyboardEvent.charCode; // 0
	domKeyboardEvent.code; // "KeyA"
	domKeyboardEvent.key; // "a"
	domKeyboardEvent.keyCode; // 65
	domKeyboardEvent.keyIdentifier; // "U+0041"

	domKeyboardEvent.detail; // 0

	domKeyboardEvent.location; // 0
	
	domKeyboardEvent.repeat; // false

	return keyboardEvent;
};

// Export
module.exports = KeyboardEvent;