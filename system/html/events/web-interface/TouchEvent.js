// Dependencies
var HtmlElementEvent = Framework.require('system/html/events/html-element/HtmlElementEvent.js');

// Class
var TouchEvent = HtmlElementEvent.extend({

	

});

// Static methods

TouchEvent.is = function(value) {
	return Class.isInstance(value, TouchEvent);
};

// Export
module.exports = TouchEvent;