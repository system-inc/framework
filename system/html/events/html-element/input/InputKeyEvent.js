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

// Static properties

InputKeyEvent.keysThatEmitKeyUpDomEventsButNotKeyPressWhenControlIsDown = {
	a: true,
	A: true,
	b: true,
	B: true,
	d: true,
	D: true,
	e: true,
	E: true,
	f: true,
	F: true,
	h: true,
	H: true,
	k: true,
	K: true,
	n: true,
	N: true,
	o: true,
	O: true,
	p: true,
	P: true,
	t: true,
	T: true,
	y: true,
	Y: true,
	space: true,
	home: true,
	end: true,
	pageUp: true,
	pageDown: true,
	numLock: true,
};

InputKeyEvent.keysThatEmitKeyUpDomEventsButNotKeyPress = {
	escape: true,

	f1: true,
	f2: true,
	f3: true,
	f4: true,
	f5: true,
	f6: true,
	f7: true,
	f8: true,
	f9: true,
	f10: true,
	f11: true,
	f12: true,

	tab: true,

	//capsLock: true,

	backspace: true,
	delete: true,

	insert: true,
	contextMenu: true,

	alt: true,
	control: true,
	meta: true,
	command: true,
	windows: true,
	shift: true,

	up: true,
	down: true,
	left: true,
	right: true,
};

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

	// For keyup events
	if(eventTypeSuffix == '.up') {
		// Keys that do not normally emit press events for which we need to manually emit one
		if(InputKeyEvent.keysThatEmitKeyUpDomEventsButNotKeyPress[inputKeyEventWithoutIdentifier.key]) {
			//Console.standardError(eventIdentifier);
			eventIdentifier = eventIdentifier.replaceLast('.up', '');
			events.append(InputKeyEvent.createFromDomEvent(domEvent, emitter, eventIdentifier));
		}
	}

	// Add the event
	events.append(inputKeyEventWithoutIdentifier);

	// Build a list of modifier keys that are down
	var modifierKeysDown = [];
	inputKeyEventWithoutIdentifier.modifierKeysDown.each(function(keyThatIsPossiblyDown, isDown) {
		// If the key is down and it doesn't match the key being emitted (to avoid emitting "input.control.control")
		if(isDown && keyThatIsPossiblyDown != inputKeyEventWithoutIdentifier.key) {
			// Rename meta to it's OS specific name
			if(keyThatIsPossiblyDown == 'meta') {
				if(Project.onWindows() && inputKeyEventWithoutIdentifier.key != 'windows') {
					modifierKeysDown.append('windows');
				}
				else if(Project.onMacOs() && inputKeyEventWithoutIdentifier.key != 'command') {
					modifierKeysDown.append('command');
				}
			}
			else {
				modifierKeysDown.append(key);
			}
		}
	});

	// If there are any modifier keys down, create additional events with the modifier keys, e.g., "input.key.a.control"
	if(modifierKeysDown.length) {
		var modifierKeysDownSuffix = '.'+modifierKeysDown.join('.');

		// Handle keys that do not emit a keypress event but that do emit a keyup event
		if(eventTypeSuffix == '.up') {
			// Keys that do not normally emit press events for which we need to manually emit one
			if(InputKeyEvent.keysThatEmitKeyUpDomEventsButNotKeyPress[inputKeyEventWithoutIdentifier.key]) {
				// e.g., "input.key.f1" for F1 which does not emit a keypress
				// TODO: Test this on Windows as Mac may not emit a keypress (because function + F1) but Windows may
				// TODO: Is this causing dupes?
				eventIdentifier = 'input.key.'+inputKeyEventWithoutIdentifier.key;
				events.append(InputKeyEvent.createFromDomEvent(domEvent, emitter, eventIdentifier));
			}

			// If the control key is down
			if(inputKeyEventWithoutIdentifier.modifierKeysDown.control) {
				if(InputKeyEvent.keysThatEmitKeyUpDomEventsButNotKeyPressWhenControlIsDown[inputKeyEventWithoutIdentifier.key]) {
					// e.g., "input.key.a"
					// TODO: Test this on Windows as Mac may not emit a keypress but Windows may
					eventIdentifier = 'input.key.'+inputKeyEventWithoutIdentifier.key;
					events.append(InputKeyEvent.createFromDomEvent(domEvent, emitter, eventIdentifier));
				}
			}
		}

		// e.g., "input.key.a.control.up", "input.key.a.control", "input.key.a.control.down"
		eventIdentifier = 'input.key.'+inputKeyEventWithoutIdentifier.key+modifierKeysDownSuffix+eventTypeSuffix;
		events.append(InputKeyEvent.createFromDomEvent(domEvent, emitter, eventIdentifier));

		// If the command key is down we need to emit some additional events since Command+Key only emits keydown events
		// So we want to fire "input.key.l.command" in addition to "input.key.l.command.down"
		if(inputKeyEventWithoutIdentifier.modifierKeysDown.meta && eventTypeSuffix == '.down') { // "command" or "windows"
			eventIdentifier = 'input.key.'+key+modifierKeysDownSuffix;
			events.append(InputKeyEvent.createFromDomEvent(domEvent, emitter, eventIdentifier));
		}
	}

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

	// InputKeyEvent.modifierKeysDown
	inputKeyEvent.modifierKeysDown.alt = domEvent.altKey;
	inputKeyEvent.modifierKeysDown.control = domEvent.ctrlKey;
	inputKeyEvent.modifierKeysDown.meta = domEvent.metaKey;
	inputKeyEvent.modifierKeysDown.shift = domEvent.shiftKey;
	
	// InputKeyEvent.keyLocation
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

	// InputKeyEvent.keyHeldDown
	if(domEvent.repeat != undefined) {
		inputKeyEvent.keyHeldDown = domEvent.repeat;
	}

	// InputKeyEvent.key
	var key = domEvent.key;

	// Lowercase key titles (keys with more than one character)
	if(key.length > 1) {
		key = key.lowercaseFirstCharacter();
	}

	// Check the key title map for a match
	var possibleKeyTitle = Keyboard.keyTitleMap[key];
	if(possibleKeyTitle) {
		key = possibleKeyTitle;
	}

	// Handle special cases
	if(key == 'unidentified' && domEvent.code == 'ContextMenu') {
		key = 'contextMenu';
	}
	else if(key == 'help' && domEvent.code == 'Insert') {
		key = 'insert';
	}
	else if(key == 'clear' && domEvent.code == 'NumLock') {
		key = 'numLock';
	}
	else if(key == 'dead') {
		key = String.fromCharCode(73);

		if(!inputKeyEvent.modifierKeysDown.shift) {
			key = key.lowercase();
		}
	}

	// Set the key
	inputKeyEvent.key = key;

	return inputKeyEvent;
};

// Export
module.exports = InputKeyEvent;