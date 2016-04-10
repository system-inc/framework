// Dependencies
var HtmlEvent = Framework.require('system/html/events/HtmlEvent.js');

// Class
var MouseEvent = HtmlEvent.extend({

	

});

// Static methods

MouseEvent.is = function(value) {
	return Class.isInstance(value, MouseEvent);
};

// Export
module.exports = MouseEvent;