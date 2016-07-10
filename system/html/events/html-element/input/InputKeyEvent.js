// Dependencies
var HtmlElementEvent = Framework.require('system/html/events/html-element/HtmlElementEvent.js');

// Class
var InputKeyEvent = HtmlElementEvent.extend({

	// InputKey keys down when the mouse event was emitted
	modifierKeysDown: {
		alt: null, // true if the alt key was down when the mouse event was emitted
		control: null, // true if the control key was down when the mouse event was emitted
		command: null,
		// meta is the Command key on macOS inputKeys or Windows key on Windows inputKeys
		meta: null, // true if the meta key was down when the mouse event was emitted
		shift: null, // true if the shift key was down when the mouse event was emitted
		windows: null,
	},

	// The key
	key: null,

	// The location of the key on the inputKey
	keyLocation: null,

	// If the key is being held down
	keyHeldDown: null,

});

// Static methods

InputKeyEvent.is = function(value) {
	return Class.isInstance(value, InputKeyEvent);
};

InputKeyEvent.createEventsFromDomEvent = function(domEvent, emitter, eventPattern) {
	Console.standardLog('InputKeyEvent.createEventsFromDomEvent arguments', domEvent.type, arguments);

	var events = [];

	// Use this for identifying which events to create
	var inputKeyEventWithoutIdentifier = InputKeyEvent.createFromDomEvent(domEvent, emitter, null);

	// "keyup" to "up", "keydown" to "down"
	var eventTypeSuffix = '.'+domEvent.type.replace('key', '');

	// Get rid of .press, no need for it, input.key.A is better than input.key.A.press
	if(eventTypeSuffix == '.press') {
		eventTypeSuffix = '';
	}

	// The identifier for the event
	var eventIdentifier = 'input.key.'+inputKeyEventWithoutIdentifier.key+eventTypeSuffix;

	// Set the identifier
	inputKeyEventWithoutIdentifier.identifier = eventIdentifier;

	// For key up events
	if(eventTypeSuffix == '.up') {
		// Keys that do not normally emit press events for which we need to manually emit one
		if(
			inputKeyEventWithoutIdentifier.key == 'alt' ||
			inputKeyEventWithoutIdentifier.key == 'control' ||
			inputKeyEventWithoutIdentifier.key == 'meta' ||
			inputKeyEventWithoutIdentifier.key == 'command' ||
			inputKeyEventWithoutIdentifier.key == 'windows' ||
			inputKeyEventWithoutIdentifier.key == 'shift' ||
			inputKeyEventWithoutIdentifier.key == 'up' ||
			inputKeyEventWithoutIdentifier.key == 'down' ||
			inputKeyEventWithoutIdentifier.key == 'left' ||
			inputKeyEventWithoutIdentifier.key == 'right' ||
			inputKeyEventWithoutIdentifier.key == 'backspace' ||
			inputKeyEventWithoutIdentifier.key == 'delete' ||
			inputKeyEventWithoutIdentifier.key == 'insert' ||
			inputKeyEventWithoutIdentifier.key == 'contextMenu' ||
			inputKeyEventWithoutIdentifier.key == 'escape'
		) {
			//Console.standardError(eventIdentifier);
			eventIdentifier = eventIdentifier.replaceLast('.up', '');
			events.append(InputKeyEvent.createFromDomEvent(domEvent, emitter, eventIdentifier));
		}

		// Create additional events with the modifier keys
		if(inputKeyEventWithoutIdentifier.key) {
			var modifierKeysDown = [];
			inputKeyEventWithoutIdentifier.modifierKeysDown.each(function(key, down) {
				console.standardLog('key', key, down);
				if(down) {
					modifierKeysDown.append(key);
				}
			});
			if(modifierKeysDown.length) {
				var key = inputKeyEventWithoutIdentifier.key;
				var modifierKeysDownString = '.'+modifierKeysDown.join('.');

				eventIdentifier = 'input.key.'+key+modifierKeysDownString;
				events.append(InputKeyEvent.createFromDomEvent(domEvent, emitter, eventIdentifier));
			}
		}
	}

	// Add the event
	events.append(inputKeyEventWithoutIdentifier);

	// Create additional events including the location of the key, e.g., "input.key.left.shift.up"
	if(
		inputKeyEventWithoutIdentifier.keyLocation == 'left' ||
		inputKeyEventWithoutIdentifier.keyLocation == 'right' ||
		inputKeyEventWithoutIdentifier.keyLocation == 'numericKeypad'
	) {
		eventIdentifier = 'input.key.'+inputKeyEventWithoutIdentifier.key+'.'+inputKeyEventWithoutIdentifier.keyLocation+eventTypeSuffix;
		events.append(InputKeyEvent.createFromDomEvent(domEvent, emitter, eventIdentifier));
	}

	// Logging
	var eventIdentifiers = [];
	events.each(function(index, event) {
		eventIdentifiers.append(event.identifier);
	});
	Console.standardInfo(eventIdentifiers.join(' '), '-', 'InputKeyEvent.createEventsFromDomEvent events', events);

	return events;
};

InputKeyEvent.createFromDomEvent = function(domEvent, emitter, identifier) {
	var inputKeyEvent = new InputKeyEvent(emitter, identifier);

	inputKeyEvent.modifierKeysDown.alt = domEvent.altKey;
	inputKeyEvent.modifierKeysDown.command = domEvent.metaKey;
	inputKeyEvent.modifierKeysDown.control = domEvent.ctrlKey;
	inputKeyEvent.modifierKeysDown.meta = domEvent.metaKey;
	inputKeyEvent.modifierKeysDown.shift = domEvent.shiftKey;
	inputKeyEvent.modifierKeysDown.windows = domEvent.metaKey;

	// Get the key
	var key = domEvent.key; // "a"

	// If there is no key but there is a keyIdentifier which is not a unicode character
	if(!key && domEvent.keyIdentifier && !domEvent.keyIdentifier.startsWith('U+')) {
		key = domEvent.keyIdentifier;
	}
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

	//Console.standardWarn('key is', key, 'for', domEvent.keyCode);

	// Special cases
	if(domEvent.keyCode == 8) {
		key = 'backspace';
	}
	else if(domEvent.keyIdentifier == 'U+0020') {
		key = 'space';
	}
	else if(domEvent.keyIdentifier == 'U+007F') {
		key = 'delete';
	}

	//Console.standardWarn('key is now', key, 'from', domEvent.keyCode);

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
	inputKeyEvent.key = key;

	inputKeyEvent.keyLocation = null;
	if(domEvent.location != undefined) {
		if(domEvent.location == 0) {
			inputKeyEvent.keyLocation = 'standard';
		}
		else if(domEvent.location == 1) {
			inputKeyEvent.keyLocation = 'left';
		}
		else if(domEvent.location == 2) {
			inputKeyEvent.keyLocation = 'right';
		}
		else if(domEvent.location == 3) {
			inputKeyEvent.keyLocation = 'numericKeypad';
		}
		else if(domEvent.location == 4) {
			inputKeyEvent.keyLocation = 'mobileDevice';
		}
		else if(domEvent.location == 5) {
			inputKeyEvent.keyLocation = 'controllerOnMobileDevice';
		}
	}

	if(domEvent.repeat != undefined) {
		inputKeyEvent.keyHeldDown = domEvent.repeat;
	}

	return inputKeyEvent;
};

// Export
module.exports = InputKeyEvent;