// Dependencies
var HtmlElementEvent = Framework.require('system/html/events/html-element/HtmlElementEvent.js');
var Keyboard = Framework.require('system/hardware/Keyboard.js');

// Class
var InputKeyEvent = HtmlElementEvent.extend({

	// The key
	key: null,

	// The location of the key on the inputKey
	keyLocation: null,

	// If the key is being held down
	keyHeldDown: null,

	// InputKey keys down when the mouse event was emitted
	modifierKeysDown: {
		alt: null, // true if the alt key was down
		control: null, // true if the control key was down
		meta: null, // true if the windows key or command key was down 
		shift: null, // true if the shift key was down
	},

});

// Static methods

InputKeyEvent.is = function(value) {
	return Class.isInstance(value, InputKeyEvent);
};

InputKeyEvent.createEventsFromDomEvent = function(domEvent, emitter, eventPattern) {
	//Console.standardLog('InputKeyEvent.createEventsFromDomEvent arguments', domEvent.type, arguments);

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
	}

	// Create additional events with the modifier keys
	var modifierKeysDown = [];
	inputKeyEventWithoutIdentifier.modifierKeysDown.each(function(key, isDown) {
		if(isDown && key != inputKeyEventWithoutIdentifier.key) {
			if(key == 'windows') {
				if(Project.onWindows()) {
					modifierKeysDown.append(key);
				}
			}
			else if(key == 'command') {
				if(Project.onMacOs()) {
					modifierKeysDown.append(key);
				}
			}
			else {
				modifierKeysDown.append(key);
			}
		}
	});
	if(modifierKeysDown.length) {
		var key = inputKeyEventWithoutIdentifier.key;
		var modifierKeysDownString = '.'+modifierKeysDown.join('.');

		// Always lowercase events with the shift modifier, so we emit input.key.a.shift instead of input.key.A.shift
		if(inputKeyEventWithoutIdentifier.modifierKeysDown.shift) {
			key = key.lowercase();
		}

		eventIdentifier = 'input.key.'+key+modifierKeysDownString+eventTypeSuffix;
		events.append(InputKeyEvent.createFromDomEvent(domEvent, emitter, eventIdentifier));
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
	Console.standardInfo(eventIdentifiers.join(' & '), '---', 'InputKeyEvent.createEventsFromDomEvent events', events);

	return events;
};

InputKeyEvent.createFromDomEvent = function(domEvent, emitter, identifier) {
	var inputKeyEvent = new InputKeyEvent(emitter, identifier);

	// modifierKeysDown
	inputKeyEvent.modifierKeysDown.alt = domEvent.altKey;
	inputKeyEvent.modifierKeysDown.control = domEvent.ctrlKey;
	inputKeyEvent.modifierKeysDown.meta = domEvent.metaKey;
	inputKeyEvent.modifierKeysDown.shift = domEvent.shiftKey;
	
	// keyLocation
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

	// keyHeldDown
	if(domEvent.repeat != undefined) {
		inputKeyEvent.keyHeldDown = domEvent.repeat;
	}

	// key
	inputKeyEvent.key = Keyboard.getKeyFromCharacterCodeAndModifiers(domEvent.keyCode, inputKeyEvent.modifierKeysDown.alt, inputKeyEvent.modifierKeysDown.control, inputKeyEvent.modifierKeysDown.meta, inputKeyEvent.modifierKeysDown.shift);

	return inputKeyEvent;
};

// Export
module.exports = InputKeyEvent;