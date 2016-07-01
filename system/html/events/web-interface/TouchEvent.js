// Dependencies
var HtmlEvent = Framework.require('system/html/events/HtmlEvent.js');

// Class
var TouchEvent = HtmlEvent.extend({

	

});

// Static methods

TouchEvent.is = function(value) {
	return Class.isInstance(value, TouchEvent);
};

// Export
module.exports = TouchEvent;