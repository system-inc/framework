// Dependencies
var HtmlElementEvent = Framework.require('system/html/events/html-element/HtmlElementEvent.js');

// Class
var MediaEvent = HtmlElementEvent.extend({

	

});

// Static methods

MediaEvent.is = function(value) {
	return Class.isInstance(value, MediaEvent);
};

// Export
module.exports = MediaEvent;