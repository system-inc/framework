// Dependencies
import HtmlElementEvent from './../HtmlElementEvent.js';

// Class
class InputKeyEvent extends HtmlElementEvent {

	// The key
	key = null;

	// The location of the key on the inputKey
	keyLocation = null;

	// If the key is being held down
	keyHeldDown = null;

	// InputKey keys down when the mouse event was emitted
	modifierKeysDown = {
		alt: null, // true if the alt key was down
		control: null, // true if the control key was down
		meta: null, // true if the windows key or command key was down 
		shift: null, // true if the shift key was down
	};

	static keysThatEmitKeyUpDomEventsButNotKeyPressWhenControlIsDown = {
		// TODO: TEST THESE ON MAC AND WINDOWS

		// These actually emit keypress on Windows
		a: true,
		A: true,
		//b: true,
		//B: true,
		c: true,
		C: true,
		//d: true,
		//D: true,
		//e: true,
		//E: true,
		//f: true,
		//F: true,
		h: true,
		H: true,
		//k: true,
		//K: true,
		//n: true,
		//N: true,
		//o: true,
		//O: true,
		//p: true,
		//P: true,
		//t: true,
		//T: true,
		v: true,
		V: true,
		x: true,
		X: true,
		y: true,
		Y: true,
		z: true,
		Z: true,

		graveAccent: true,
		tilde: true,

		//space: true,
		home: true,
		end: true,
		pageUp: true,
		pageDown: true,
		numLock: true,
	};

	static keysThatEmitKeyUpDomEventsButNotKeyPress = {
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

	static modifierKeys = {
		alt: true,
		control: true,
		meta: true,
		command: true,
		windows: true,
		shift: true,
	};


	static keyTitleMap = {
		'~': 'tilde',
		'`': 'graveAccent',

		'!': 'exclamation',
		'@': 'at',
		'#': 'number',
		'$': 'dollar',
		'%': 'percent',
		'^': 'caret',
		'&': 'ampersand',
		'*': 'asterisk',
		'(': 'leftParenthesis',
		')': 'rightParenthesis',

		'-': 'minus',
		'_': 'underscore',
		'=': 'equals',
		'+': 'plus',

		'[': 'leftBracket',
		'{': 'leftBrace',
		']': 'rightBracket',
		'}': 'rightBrace',
		'\\': 'backslash',
		'|': 'verticalBar',

		';': 'semicolon',
		':': 'colon',
		'\'': 'singleQuote',
		'"': 'doubleQuote',

		',': 'comma',
		'<': 'lessThan',
		'.': 'period',
		'>': 'moreThan',
		'/': 'forwardSlash',
		'?': 'question',

		' ': 'space',

		'meta': (app.onWindows() ? 'windows' : (app.onMacOs() ? 'command' : 'meta')),

		'arrowUp': 'up',
		'arrowDown': 'down',
		'arrowLeft': 'left',
		'arrowRight': 'right',
	};

	static keyCodeMap = {
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
		12: 'l',
		13: 'm',
		14: 'n',
		15: 'o',
		16: 'p',
		17: 'q',
		18: 'r',
		19: 's',
		20: 't',
		21: 'u',
		22: 'v',
		23: 'w',
		24: 'x',
		25: 'y',
		26: 'z',
	};

	static unicodeMap = {
		'U+0008': 'backspace',
		'U+0020': 'space',
		'U+007F': 'delete',
	};

	static is(value) {
		return Class.isInstance(value, InputKeyEvent);
	}

	static createEventsFromDomEvent(domEvent, emitter, eventPattern) {
		//Console.standardLog('InputKeyEvent.createEventsFromDomEvent arguments', domEvent.type, arguments);
		//app.log('--- start '+domEvent.type);

		var events = [];

		// Use this for identifying which events to create
		var inputKeyEventWithoutIdentifier = InputKeyEvent.createFromDomEvent(domEvent, emitter, null);

		// "keyup" to "up", "keydown" to "down"
		var eventTypeSuffix = '.'+domEvent.type.replace('key', '');

		// Get rid of .press, no need for it, input.key.A is better than input.key.A.press
		if(eventTypeSuffix == '.press') {
			eventTypeSuffix = '';
		}

		// Build a list of modifier keys that are down
		var modifierKeysDown = [];
		inputKeyEventWithoutIdentifier.modifierKeysDown.each(function(keyThatIsPossiblyDown, isDown) {
			// If the key is down and it doesn't match the key being emitted (to avoid emitting "input.control.control")
			if(isDown && keyThatIsPossiblyDown != inputKeyEventWithoutIdentifier.key) {
				// Rename meta to it's OS specific name
				if(keyThatIsPossiblyDown == 'meta') {
					if(app.onWindows() && inputKeyEventWithoutIdentifier.key != 'windows') {
						modifierKeysDown.append('windows');
					}
					else if(app.onMacOs() && inputKeyEventWithoutIdentifier.key != 'command') {
						modifierKeysDown.append('command');
					}
				}
				else {
					modifierKeysDown.append(keyThatIsPossiblyDown);
				}
			}
		});
		var modifierKeysDownSuffix = '.'+modifierKeysDown.join('.');

		// The identifier for the event
		// e.g., "input.key.a.down"
		var eventIdentifier = 'input.key.'+inputKeyEventWithoutIdentifier.key+eventTypeSuffix;
		inputKeyEventWithoutIdentifier.identifier = eventIdentifier;

		// For keyup events
		if(eventTypeSuffix == '.up') {
			// Keys that do not normally emit press events for which we need to manually emit one
			if(InputKeyEvent.keysThatEmitKeyUpDomEventsButNotKeyPress[inputKeyEventWithoutIdentifier.key]) {
				//Console.standardError(eventIdentifier);
				eventIdentifier = 'input.key.'+inputKeyEventWithoutIdentifier.key;
				//app.log(eventIdentifier);
				events.append(InputKeyEvent.createFromDomEvent(domEvent, emitter, eventIdentifier));

				if(inputKeyEventWithoutIdentifier.keyLocation != 'standard') {
					eventIdentifier = 'input.key.'+inputKeyEventWithoutIdentifier.key+'.'+inputKeyEventWithoutIdentifier.keyLocation;
					//app.log(eventIdentifier);
					events.append(InputKeyEvent.createFromDomEvent(domEvent, emitter, eventIdentifier));
				}

				if(modifierKeysDown.length) {
					eventIdentifier = 'input.key.'+inputKeyEventWithoutIdentifier.key+modifierKeysDownSuffix;
					//app.log(eventIdentifier);
					events.append(InputKeyEvent.createFromDomEvent(domEvent, emitter, eventIdentifier));

					// Create additional events including the location of the key
					if(inputKeyEventWithoutIdentifier.keyLocation != 'standard') {
						// Create additional events including the location of the key
						eventIdentifier = 'input.key.'+inputKeyEventWithoutIdentifier.key+'.'+inputKeyEventWithoutIdentifier.keyLocation+modifierKeysDownSuffix;
						//app.log(eventIdentifier);
						events.append(InputKeyEvent.createFromDomEvent(domEvent, emitter, eventIdentifier));
					}
				}
			}
		}

		if(
			modifierKeysDown.length &&
			eventTypeSuffix == '.up' &&
			inputKeyEventWithoutIdentifier.modifierKeysDown.control &&
			InputKeyEvent.keysThatEmitKeyUpDomEventsButNotKeyPressWhenControlIsDown[inputKeyEventWithoutIdentifier.key]
		) {
			// Do nothing
		}
		else {
			//app.log(inputKeyEventWithoutIdentifier.identifier);
			events.append(inputKeyEventWithoutIdentifier);
		}

		if(inputKeyEventWithoutIdentifier.keyLocation != 'standard') {
			eventIdentifier = 'input.key.'+inputKeyEventWithoutIdentifier.key+'.'+inputKeyEventWithoutIdentifier.keyLocation+eventTypeSuffix;
			//app.log(eventIdentifier);
			events.append(InputKeyEvent.createFromDomEvent(domEvent, emitter, eventIdentifier));
		}

		// If there are any modifier keys down, create additional events with the modifier keys, e.g., "input.key.a.control"
		if(modifierKeysDown.length) {
			// Handle keys that do not emit a keypress event but that do emit a keyup event
			if(
				eventTypeSuffix == '.up' &&
				inputKeyEventWithoutIdentifier.modifierKeysDown.control && // If the control key is down
				inputKeyEventWithoutIdentifier.key != 'control' &&
				InputKeyEvent.keysThatEmitKeyUpDomEventsButNotKeyPressWhenControlIsDown[inputKeyEventWithoutIdentifier.key]
			) {
				// e.g., "input.key.a"
				eventIdentifier = 'input.key.'+inputKeyEventWithoutIdentifier.key;
				//app.log(eventIdentifier);
				events.append(InputKeyEvent.createFromDomEvent(domEvent, emitter, eventIdentifier));

				// e.g., "input.key.a.control"
				eventIdentifier = 'input.key.'+inputKeyEventWithoutIdentifier.key+modifierKeysDownSuffix;
				//app.log(eventIdentifier);
				events.append(InputKeyEvent.createFromDomEvent(domEvent, emitter, eventIdentifier));

				// e.g., "input.key.a.up"
				eventIdentifier = 'input.key.'+inputKeyEventWithoutIdentifier.key+eventTypeSuffix;
				//app.log(eventIdentifier);
				events.append(InputKeyEvent.createFromDomEvent(domEvent, emitter, eventIdentifier));
			}

			// e.g., "input.key.a.control.up", "input.key.a.control", "input.key.a.control.down"
			eventIdentifier = 'input.key.'+inputKeyEventWithoutIdentifier.key+modifierKeysDownSuffix+eventTypeSuffix;
			//app.log(eventIdentifier);
			events.append(InputKeyEvent.createFromDomEvent(domEvent, emitter, eventIdentifier));

			// Create additional events including the location of the key
			if(inputKeyEventWithoutIdentifier.keyLocation != 'standard') {
				// Create additional events including the location of the key
				eventIdentifier = 'input.key.'+inputKeyEventWithoutIdentifier.key+'.'+inputKeyEventWithoutIdentifier.keyLocation+modifierKeysDownSuffix+eventTypeSuffix;
				//app.log(eventIdentifier);
				events.append(InputKeyEvent.createFromDomEvent(domEvent, emitter, eventIdentifier));
			}

			// If the command key is down we need to emit some additional events since Command+Key only emits keydown events
			// So we want to fire "input.key.l.command" in addition to "input.key.l.command.down"
			if(
				inputKeyEventWithoutIdentifier.modifierKeysDown.meta && // "command" or "windows"
				InputKeyEvent.modifierKeys[inputKeyEventWithoutIdentifier.key] == undefined && // do not include modifier keys as they still emit key up
				eventTypeSuffix == '.down'
			) {
				eventIdentifier = 'input.key.'+inputKeyEventWithoutIdentifier.key;
				//app.log(eventIdentifier);
				events.append(InputKeyEvent.createFromDomEvent(domEvent, emitter, eventIdentifier));

				eventIdentifier = 'input.key.'+inputKeyEventWithoutIdentifier.key+modifierKeysDownSuffix;
				//app.log(eventIdentifier);
				events.append(InputKeyEvent.createFromDomEvent(domEvent, emitter, eventIdentifier));
			}
		}

		// Logging
		//var eventIdentifiers = [];
		//events.each(function(index, event) {
		//	eventIdentifiers.append(event.identifier);
		//});
		//Console.standardInfo(eventIdentifiers.join(' & '), '---', 'InputKeyEvent.createEventsFromDomEvent events', events);
		//Console.standardInfo('InputKeyEvent.createEventsFromDomEvent events', events);

		//app.log('--- end '+domEvent.type);

		return events;
	}

	static createFromDomEvent(domEvent, emitter, identifier) {
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

			// Set dead keys to null
			if(key == 'dead') {
				key = null;
			}
		}

		// Check the key title map for a match
		var possibleKeyTitle = InputKeyEvent.keyTitleMap[key];
		if(possibleKeyTitle) {
			key = possibleKeyTitle;
		}

		// Handle special cases
		if(
			// If the control key is down and it is a press event
			inputKeyEvent.modifierKeysDown.control &&
			domEvent.type == 'keypress' &&
			domEvent.keyCode >= 1 && domEvent.keyCode <= 26
		) {
			if(domEvent.code && domEvent.code.startsWith('Key')) {
				key = domEvent.code.replace('Key', '');
			}
			else {
				key = InputKeyEvent.keyCodeMap[domEvent.keyCode];	
			}
		}
		else if(key == 'unidentified' && domEvent.code == 'ContextMenu') {
			key = 'contextMenu';
		}
		else if(key == 'help' && domEvent.code == 'Insert') {
			key = 'insert';
		}
		else if(key == 'clear' && domEvent.code == 'NumLock') {
			key = 'numLock';
		}
		else if(key == ' ') {
			key = 'space';
		}
		else if(!key || (key.length == 1 && !key.match(/\w/))) {
			//Console.standardLog('no key', domEvent);

			if(domEvent.charCode) {
				key = String.fromCharacterCode(domEvent.charCode);
				app.log('String.fromCharacterCode', domEvent.charCode, 'key:', key);
			}
			
			if((!key || (key.length == 1 && !key.match(/\w/))) && domEvent.keyIdentifier && !domEvent.keyIdentifier.startsWith('U+')) {
				// If we don't have a key which will display a character
				key = domEvent.keyIdentifier.lowercaseFirstCharacter();

				if(key == 'win') {
					key = InputKeyEvent.keyTitleMap['meta'];
				}

				app.log('domEvent.keyIdentifier', key);
			}

			if((!key || (key.length == 1 && !key.match(/\w/))) && domEvent.code) {
				key = domEvent.code.replaceFirst('Key', '').lowercaseFirstCharacter();
				app.log('InputKeyEvent.keyCodeMap domEvent.keyCode', key);
			}
			
			if((!key || (key.length == 1 && !key.match(/\w/))) && domEvent.keyCode) {
				key = InputKeyEvent.keyCodeMap[domEvent.keyCode];
				app.log('InputKeyEvent.keyCodeMap domEvent.keyCode', key);
			}
			
			if((!key || (key.length == 1 && !key.match(/\w/))) && domEvent.keyIdentifier && domEvent.keyIdentifier.startsWith('U+')) {
				key = InputKeyEvent.unicodeMap[domEvent.keyIdentifier];
				app.log('InputKeyEvent.unicodeMap domEvent.keyCode', key);
			}

			if((!key || (key.length == 1 && !key.match(/\w/))) && domEvent.keyIdentifier && domEvent.keyIdentifier.startsWith('U+')) {
				key = InputKeyEvent.unicodeMap[domEvent.keyIdentifier];
				app.log('InputKeyEvent.unicodeMap domEvent.keyCode', key);
			}
		}

		// Make sure we have the right case
		if(key && key.length == 1) {
			if(inputKeyEvent.modifierKeysDown.shift) {
				key = key.uppercase();
			}
			else {
				key = key.lowercase();
			}
		}

		//app.log('key', key, 'key is truthy', (key ? true : false));

		if(!key) {
			Console.standardError('no key for domEvent', domEvent);
		}

		// Set the key
		inputKeyEvent.key = key;

		return inputKeyEvent;
	}

}

// Export
export default InputKeyEvent;
