KeyboardShortcutsClass = Class.extend({

	listeningToKeyboardEvents: false,
	keyboardShortcuts: [],

	construct: function() {
	},

	add: function(keys, callback, settings) {
		// Lazy listen to keyboard events
		if(!this.listeningToKeyboardEvents) {
			this.listenToKeyboardEvents();
		}

		var keyboardShortcut = new KeyboardShortcut(keys, callback, settings);

		this.keyboardShortcuts.append(keyboardShortcut);

		return keyboardShortcut;
	},

	remove: function(keys) {
	},

	clear: function() {
	},

	listenToKeyboardEvents: function() {
		console.log('listenToKeyboardEvents');

		HtmlDocument.on('keyup', this.handleKeyboardEvent.bind(this));
		HtmlDocument.on('keydown', this.handleKeyboardEvent.bind(this));
		HtmlDocument.on('keypress', this.handleKeyboardEvent.bind(this));

		this.listeningToKeyboardEvents = true;
	},

	handleKeyboardEvent: function(event) {
		console.log('handleKeyboardEvent', event);

		this.keyboardShortcuts.each(function(index, keyboardShortcut) {
			if(keyboardShortcut.matchesKeyboardActivity(event)) {
				keyboardShortcut.callback(event);
			}
		});
	},

});

KeyboardShortcuts = new KeyboardShortcutsClass();