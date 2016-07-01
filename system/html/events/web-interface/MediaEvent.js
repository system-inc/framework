// Dependencies
var HtmlEvent = Framework.require('system/html/events/HtmlEvent.js');

// Class
var MediaEvent = HtmlEvent.extend({

	

});

// Static methods

MediaEvent.is = function(value) {
	return Class.isInstance(value, MediaEvent);
};

// Export
module.exports = MediaEvent;