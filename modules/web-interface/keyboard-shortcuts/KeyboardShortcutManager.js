// Dependencies
var KeyboardShortcut = Framework.require('modules/web-interface/keyboard-shortcuts/KeyboardShortcut.js');

// Class
var KeyboardShortcutManager = Class.extend({

	htmlDocument: null,

	listeningToKeyboardEvents: false,
	keyboardShortcuts: [],
	keyboardActivity: [],
	keyboardActivityTimer: null,

	construct: function(htmlDocument) {
		this.htmlDocument = htmlDocument;

		// Build the key codes programmatically
		this.buildKeyCodes();
	},

	buildKeyCodes: function() {
		// Loop through the f keys, f1 to f19 and add them to the map programatically
		for(var i = 1; i < 20; ++i) {
			KeyboardShortcutManager.keyCodes[111 + i] = 'f'+i;
		}

		// Loop through to map numbers on the numeric keypad
		for(i = 0; i <= 9; ++i) {
			KeyboardShortcutManager.keyCodes[i + 96] = i;
		}

		// Store the reverse as well
		KeyboardShortcutManager.keyCodes.each(function(key, value) {
			KeyboardShortcutManager.keyCodes[value] = key;
		}.bind(this));
	},

	add: function(keys, callback, settings) {
		// Lazy listen to keyboard events
		if(!this.listeningToKeyboardEvents) {
			this.listenToKeyboardEvents();
		}

		// Allow keys to be passed as an array as shorthand to create multiple keyboard shortcuts that do the same thing
		keys.toArray().each(function(index, keysArrayItem) {
			var keyboardShortcut = new KeyboardShortcut(keysArrayItem, callback, settings);
			this.keyboardShortcuts.append(keyboardShortcut);
		}.bind(this));
	},

	remove: function(keys) {
		// Remove all keyboard shortcuts matching keys
	},

	clear: function() {
		// Remove all keyboard shortcuts and associated event listeners
	},

	listenToKeyboardEvents: function() {
		//Console.log('listenToKeyboardEvents');

		this.htmlDocument.on('keyup', this.handleKeyboardEvent.bind(this));
		this.htmlDocument.on('keydown', this.handleKeyboardEvent.bind(this));
		this.htmlDocument.on('keypress', this.handleKeyboardEvent.bind(this));

		this.listeningToKeyboardEvents = true;
	},

	eventToKeyboardEvent: function(event) {
		var keyboardEvent = {};

		// Set the type
		if(event.type == 'keyup') {
			keyboardEvent.type = 'keyUp';	
		}
		else if(event.type == 'keydown') {
			keyboardEvent.type = 'keyDown';	
		}
		else if(event.type == 'keypress') {
			keyboardEvent.type = 'keyPress';	
		}
		
		// Set the key
		keyboardEvent.key = this.keyFromEvent(event);

		// Set the modifiers
		keyboardEvent.modifiers = this.modifiersFromEvent(event);

		return keyboardEvent;
	},

	keyFromEvent: function(event) {
		var key = String.fromCharCode(event.which);

		// For keypress events we should return the character as is
		if(event.type == 'keypress') {
		    key = String.fromCharCode(event.which);

		    // If the shift key is not pressed then it is safe to assume that we want the character to be lowercase
		    // This means if you accidentally have caps lock on then your key bindings will continue to work
		    // The only side effect that might not be desired is if you bind something like 'A' because you want to trigger an event when capital A is pressed caps lock will no longer trigger the event
		    // Shift+a will though.
		    if(!event.shiftKey) {
	        	key = key.lowercase();
		    }
		}
		else if(KeyboardShortcutManager.keyCodes[event.which]) {
			key = KeyboardShortcutManager.keyCodes[event.which];
		}
		// If it is not in the special maps
		else {
			// With keydown and keyup events the character seems to always come in as an uppercase character whether you are pressing shift or not. We should make sure it is always lowercase for comparisons
			key = String.fromCharCode(event.which).lowercase();	
		}

		return key;
	},

	modifiersFromEvent: function(event) {
		var modifiers = [];

        if(event.shiftKey) {
            modifiers.append('shift');
        }
        if(event.altKey) {
            modifiers.append('alt');
        }
        if(event.ctrlKey) {
            modifiers.append('ctrl');
        }
        if(event.metaKey) {
            modifiers.append('meta');
        }

        return modifiers;
	},

	handleKeyboardEvent: function(event) {
		//Console.log('handleKeyboardEvent', event);

		var keyboardEvent = this.eventToKeyboardEvent(event);
		//Console.log('keyboardEvent', keyboardEvent);

		// Add the keyboard event to the keyboard activity
		this.keyboardActivity.append(keyboardEvent);

		// Extend the timer by another second to gather more key strokes
		clearTimeout(this.keyboardActivityTimer);
		this.keyboardActivityTimer = setTimeout(this.clearKeyboardActivity, 1000);

		// Throw keyboard activity against all keyboard shortcuts looking for a match
		this.keyboardShortcuts.each(function(index, keyboardShortcut) {
			if(keyboardShortcut.matchesKeyboardActivity(this.keyboardActivity)) {
				keyboardShortcut.callback(event);
			}
		}.bind(this));
	},

	clearKeyboardActivity: function() {
		//Console.log('clearKeyboardActivity');
		this.keyboardActivity = [];
	},

});

// Static properties

// Special key codes cannot use keypress events so it has to be here to map to the correct keycodes for keyup/keydown events
KeyboardShortcutManager.keyCodes = {
	8: 'backspace',
    9: 'tab',
    13: 'enter',
    16: 'shift',
    17: 'ctrl',
    18: 'alt',
    20: 'capslock',
    27: 'esc',
    32: 'space',
    33: 'pageup',
    34: 'pagedown',
    35: 'end',
    36: 'home',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    45: 'ins',
    46: 'del',
    91: 'meta',
    93: 'meta',
    224: 'meta',

    106: '*',
    107: '+',
    109: '-',
    110: '.',
    111 : '/',
    186: ';',
    187: '=',
    188: ',',
    189: '-',
    190: '.',
    191: '/',
    192: '`',
    219: '[',
    220: '\\',
    221: ']',
    222: '\'',
};

// Keys that require a shift on a U.S. keyboard
KeyboardShortcutManager.shiftMap = {
	'~': '`',
    '!': 1,
    '@': 2,
    '#': 3,
    '$': 4,
    '%': 5,
    '^': 6,
    '&': 7,
    '*': 8,
    '(': 9,
    ')': 0,
    '_': '-',
    '+': '=',
    ':': ';',
    '\"': '\'',
    '<': ',',
    '>': '.',
    '?': '/',
    '|': '\\',
};

// Export
module.exports = KeyboardShortcutManager;