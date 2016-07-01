// Dependencies
var HtmlEvent = Framework.require('system/html/events/HtmlEvent.js');

// Class
var WindowEvent = HtmlEvent.extend({

	

});

// Static methods

WindowEvent.is = function(value) {
	return Class.isInstance(value, WindowEvent);
};

// Export
module.exports = WindowEvent;