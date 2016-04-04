// Dependencies
var Shortcut = Framework.require('system/web-interface/shortcuts/Shortcut.js');

// Class
var ShortcutManager = Class.extend({

	htmlDocument: null,

	listeningToEvents: false,
	shortcuts: [],
	activity: [],
	activityTimer: null,

	construct: function(htmlDocument) {
		this.htmlDocument = htmlDocument;
	},

	add: function(keys, callback, settings) {
		// Lazy listen to events
		if(!this.listeningToEvents) {
			this.listenToEvents();
		}

		// Allow keys to be passed as an array as shorthand to create multiple shortcuts that do the same thing
		keys.toArray().each(function(index, keysArrayItem) {
			var shortcut = new Shortcut(keysArrayItem, callback, settings);
			this.shortcuts.append(shortcut);
		}.bind(this));
	},

	remove: function(keys) {
		// Remove all shortcuts matching keys
	},

	clear: function() {
		// Remove all shortcuts and associated event listeners
	},

	listenToEvents: function() {
		//Console.log('listenToEvents');

		this.htmlDocument.on('keyup', this.handleEvent.bind(this));
		this.htmlDocument.on('keydown', this.handleEvent.bind(this));
		this.htmlDocument.on('keypress', this.handleEvent.bind(this));

		this.listeningToEvents = true;
	},

	eventToShortcutEvent: function(event) {
		var shortcutEvent = {};

		// Set the type
		if(event.type == 'keyup') {
			shortcutEvent.type = 'keyUp';	
		}
		else if(event.type == 'keydown') {
			shortcutEvent.type = 'keyDown';	
		}
		else if(event.type == 'keypress') {
			shortcutEvent.type = 'keyPress';	
		}
		
		// Set the key
		shortcutEvent.key = this.keyFromEvent(event);

		// Set the modifiers
		shortcutEvent.modifiers = this.modifiersFromEvent(event);

		return shortcutEvent;
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
		else if(Shortcut.keyCodes[event.which]) {
			key = Shortcut.keyCodes[event.which];
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

	handleEvent: function(event) {
		event = event.data;

		//Console.log('handleEvent', event);

		shortcutEvent = this.eventToShortcutEvent(event);
		//Console.log('event', event);

		// Add the event to the activity
		this.activity.append(shortcutEvent);

		// Extend the timer by another second to gather more key strokes
		clearTimeout(this.activityTimer);
		this.activityTimer = setTimeout(this.clearActivity, 1000);

		// Throw activity against all shortcuts looking for a match
		this.shortcuts.each(function(index, shortcut) {
			if(shortcut.matchesActivity(this.activity)) {
				shortcut.callback(shortcutEvent);
			}
		}.bind(this));
	},

	clearActivity: function() {
		//Console.log('clearActivity');
		this.activity = [];
	},

});

// Export
module.exports = ShortcutManager;