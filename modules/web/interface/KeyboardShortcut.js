KeyboardShortcut = Class.extend({

	keys: null,
	callback: null,
	settings: null,
	eventListener: null,
	
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

		// Set the trigger setting is trigger is automatic
		if(this.settings.get('trigger') == 'automatic') {
			this.settings.set('trigger', 'keyDown');
		}
	},

	matchesKeyboardActivity: function(keyboardEvent) {
		var matchesKeyboardActivity = false;

		// Make sure the event type matches
		//console.log('comparing', keyboardEvent.type, 'to', this.settings.get('trigger').lowercase());
		if(keyboardEvent.type == this.settings.get('trigger').lowercase()) {
			
			if(keyboardEvent.type == 'keydown' && keyboardEvent.ctrlKey && keyboardEvent.which == 82) {
	            matchesKeyboardActivity = true;
	        }
		}		

		return matchesKeyboardActivity;
	},

});