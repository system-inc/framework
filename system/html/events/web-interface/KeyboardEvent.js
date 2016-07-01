// Dependencies
var HtmlEvent = Framework.require('system/html/events/HtmlEvent.js');

// Class
var KeyboardEvent = HtmlEvent.extend({

	

});

// Static methods

KeyboardEvent.is = function(value) {
	return Class.isInstance(value, KeyboardEvent);
};

// Export
module.exports = KeyboardEvent;