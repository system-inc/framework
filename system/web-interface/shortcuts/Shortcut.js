// Dependencies
var Settings = Framework.require('system/settings/Settings.js');

// Class
var Shortcut = Class.extend({

	keys: null, // Store what the user asked for requested
	sequence: [], // Most of this time this will just have one entry, but we can handle a sequence of events, e.g., the user can press 'up up down down down left right'

	callback: null,
	settings: null,

	construct: function(keys, callback, settings) {
		// Initialize settings
		this.settings = new Settings(settings, {
			trigger: 'automatic', // automatic (looks at keys and determines keyDown or keyPress), keyDown, keyUp, keyPress
			triggerFromInputAcceptingElements: true,
			triggerFromTextInputs: true,
			triggerFromContentEditable: true,
		});

		// Set the callback
		this.callback = callback;

		// Parse the keys, keys can come in like 'Ctrl+W', ['Ctrl+W', 'Command+W'], or 'up up down down down left right'
		this.keys = keys;
		this.parseKeys(this.keys);

		// Set the trigger setting if trigger is automatic
		if(this.settings.get('trigger') == 'automatic') {
			var firstSequenceEntry = this.sequence.first();

			// Use keyPress by default
			if(Shortcut.keyCodes[firstSequenceEntry.key]) {
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
				if(Shortcut.modifierAliases[keysForSequenceArrayKey]) {
					keysForSequenceArrayKey = Shortcut.modifierAliases[keysForSequenceArrayKey];
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

		if(modifiers.contains(string) || Shortcut.modifierAliases[string]) {
			isModifier = true;
		}

		return isModifier;
	},

	matchesActivity: function(activity) {
		var matchesActivity = false;

		// TODO build sequences
		// Just use the last event for now
		var event = activity.last();
		var sequenceEntry = this.sequence.first();

		//Console.log('comparing', event, 'to', sequenceEntry);
		// If the event is the same
		if(event.type == this.settings.get('trigger')) {
			// If the key is the same
			if(event.key == sequenceEntry.key) {
				// If the modifiers are the same
				//Console.log('comparing', event.modifiers.sort().join(','), 'to', sequenceEntry.modifiers.sort().join(','));
				if(event.modifiers.sort().join(',') === sequenceEntry.modifiers.sort().join(',')) {
					matchesActivity = true;
				}
			}
		}

		return matchesActivity;
	},

});

// Static properties

Shortcut.modifierAliases = {
	'control': 'ctrl',
	'option': 'alt',
    'command': 'meta',
    'return': 'enter',
    'escape': 'esc',
    'plus': '+',
    'mod': (global['navigator'] && /Mac|iPod|iPhone|iPad/.test(navigator.platform)) ? 'meta' : 'ctrl',
};

// Special key codes cannot use keypress events so it has to be here to map to the correct keycodes for keyup/keydown events
Shortcut.keyCodes = {
	'0': '96',
	'1': '97',
	'2': '98',
	'3': '99',
	'4': '100',
	'5': '101',
	'6': '102',
	'7': '103',
	'8': '104',
	'9': '105',
	'13': 'enter',
	'16': 'shift',
	'17': 'ctrl',
	'18': 'alt',
	'20': 'capslock',
	'27': 'esc',
	'32': 'space',
	'33': 'pageup',
	'34': 'pagedown',
	'35': 'end',
	'36': 'home',
	'37': 'left',
	'38': 'up',
	'39': 'right',
	'40': 'down',
	'45': 'ins',
	'46': 'del',
	'91': 'meta',
	'93': 'meta',
	'96': '0',
	'97': '1',
	'98': '2',
	'99': '3',
	'100': '4',
	'101': '5',
	'102': '6',
	'103': '7',
	'104': '8',
	'105': '9',
	'106': '*',
	'107': '+',
	'109': '-',
	'110': '.',
	'111': '/',
	'112': 'f1',
	'113': 'f2',
	'114': 'f3',
	'115': 'f4',
	'116': 'f5',
	'117': 'f6',
	'118': 'f7',
	'119': 'f8',
	'120': 'f9',
	'121': 'f10',
	'122': 'f11',
	'123': 'f12',
	'124': 'f13',
	'125': 'f14',
	'126': 'f15',
	'127': 'f16',
	'128': 'f17',
	'129': 'f18',
	'130': 'f19',
	'186': ';',
	'187': '=',
	'188': ',',
	'189': '-',
	'190': '.',
	'191': '/',
	'192': '`',
	'219': '[',
	'220': '\\',
	'221': ']',
	'222': '\'',
	'224': 'meta',
	'backspace': '8',
	'tab': '9',
	'enter': '13',
	'shift': '16',
	'ctrl': '17',
	'alt': '18',
	'capslock': '20',
	'esc': '27',
	'space': '32',
	'pageup': '33',
	'pagedown': '34',
	'end': '35',
	'home': '36',
	'left': '37',
	'up': '38',
	'right': '39',
	'down': '40',
	'ins': '45',
	'del': '46',
	'meta': '224',
	'*': '106',
	'+': '107',
	'-': '189',
	'.': '190',
	'/': '191',
	'f1': '112',
	'f2': '113',
	'f3': '114',
	'f4': '115',
	'f5': '116',
	'f6': '117',
	'f7': '118',
	'f8': '119',
	'f9': '120',
	'f10': '121',
	'f11': '122',
	'f12': '123',
	'f13': '124',
	'f14': '125',
	'f15': '126',
	'f16': '127',
	'f17': '128',
	'f18': '129',
	'f19': '130',
	';': '186',
	'=': '187',
	',': '188',
	'`': '192',
	'[': '219',
	'\\': '220',
	']': '221',
	'\'': '222',
};

// Keys that require a shift on a U.S. keyboard
Shortcut.shiftMap = {
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
module.exports = Shortcut;