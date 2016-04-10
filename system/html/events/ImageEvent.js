// Dependencies
var HtmlEvent = Framework.require('system/html/events/HtmlEvent.js');

// Class
var ImageEvent = HtmlEvent.extend({

	

});

// Static methods

ImageEvent.is = function(value) {
	return Class.isInstance(value, ImageEvent);
};

// Export
module.exports = ImageEvent;