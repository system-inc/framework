// Dependencies
var HtmlEvent = Framework.require('system/html/events/HtmlEvent.js');

// Class
var ClipboardEvent = HtmlEvent.extend({

	

});

// Static methods

ClipboardEvent.is = function(value) {
	return Class.isInstance(value, ClipboardEvent);
};

// Export
module.exports = ClipboardEvent;