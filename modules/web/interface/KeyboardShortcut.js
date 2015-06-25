KeyboardShortcut = Class.extend({

	keys: null, // Store what the user asked for requested
	sequence: [], // Most of this time this will just have one entry, but we can handle a sequence of keyboard events, e.g., the user can press 'up up down down down left right'

	callback: null,
	settings: null,

	construct: function(keys, callback, settings) {
		// Initialize settings
		this.settings = Settings.default({
			trigger: 'automatic', // automatic (looks at keys and determines keyDown or keyPress), keyDown, keyUp, keyPress
			triggerFromInputAcceptingElements: true,
			triggerFromTextInputs: true,
			triggerFromContentEditable: true,
		}, settings);

		// Set the callback
		this.callback = callback;

		// Parse the keys, keys can come in like 'Ctrl+W', ['Ctrl+W', 'Command+W'], or 'up up down down down left right'
		this.keys = keys;
		this.parseKeys(this.keys);

		// Set the trigger setting if trigger is automatic
		if(this.settings.get('trigger') == 'automatic') {
			var firstSequenceEntry = this.sequence.first();

			// Use keyPress by default
			if(KeyboardShortcuts.keyCodes[firstSequenceEntry.key]) {
				this.settings.set('trigger', 'keyDown');
			}
			else {
				this.settings.set('trigger', 'keyPress');
			}

			// Modifier keys don't work as expected with keyPress, use to keyDown
			if(firstSequenceEntry.modifiers.length) {
				this.settings.set('trigger', 'keyDown');
			}
		}
	},

	parseKeys: function(keys) {
		// Lowercase everything for parsing
		keys = keys.lowercase();

		// Split to build sequence
		keysArray = keys.split(' ');

		// Walk through each sequence
		keysArray.each(function(keyArrayIndex, keysForSequence) {
			// Split on + to get all of the keys involved
			var keysForSequenceArray = keysForSequence.split('+');

			// Prepare the sequence entry
			var sequenceEntry = {
				key: null,
				modifiers: [],
			};

			// Walk through the split keys to find modifiers
			keysForSequenceArray.each(function(keysForSequenceArrayIndex, keysForSequenceArrayKey) {
				// Use modifier aliases
				if(KeyboardShortcut.modifierAliases[keysForSequenceArrayKey]) {
					keysForSequenceArrayKey = KeyboardShortcut.modifierAliases[keysForSequenceArrayKey];
				}

				if(this.isModifier(keysForSequenceArrayKey)) {
					sequenceEntry.modifiers.append(keysForSequenceArrayKey);
				}
				else {
					sequenceEntry.key = keysForSequenceArrayKey;
				}
			}.bind(this));

			// Add the sequence entry to the sequence
			this.sequence.append(sequenceEntry);
		}.bind(this));

		this.keys = keys;
	},

	isModifier: function(string) {
		var isModifier = false;
		var modifiers = ['shift', 'alt', 'ctrl', 'meta'];

		if(modifiers.contains(string) || KeyboardShortcut.modifierAliases[string]) {
			isModifier = true;
		}

		return isModifier;
	},

	matchesKeyboardActivity: function(keyboardActivity) {
		var matchesKeyboardActivity = false;

		// TODO build keyboard sequences
		// Just use the last keyboard event for now
		var keyboardEvent = keyboardActivity.last();
		var sequenceEntry = this.sequence.first();

		//console.log('comparing', keyboardEvent, 'to', sequenceEntry);
		// If the event is the same
		if(keyboardEvent.type == this.settings.get('trigger')) {
			// If the key is the same
			if(keyboardEvent.key == sequenceEntry.key) {
				// If the modifiers are the same
				//console.log('comparing', keyboardEvent.modifiers.sort().join(','), 'to', sequenceEntry.modifiers.sort().join(','));
				if(keyboardEvent.modifiers.sort().join(',') === sequenceEntry.modifiers.sort().join(',')) {
					matchesKeyboardActivity = true;
				}
			}
		}

		return matchesKeyboardActivity;
	},

});

// Static properties
KeyboardShortcut.modifierAliases = {
	'control': 'ctrl',
	'option': 'alt',
    'command': 'meta',
    'return': 'enter',
    'escape': 'esc',
    'plus': '+',
    'mod': (global['navigator'] && /Mac|iPod|iPhone|iPad/.test(navigator.platform)) ? 'meta' : 'ctrl',
};