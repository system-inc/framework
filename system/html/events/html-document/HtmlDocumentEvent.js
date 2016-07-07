// Dependencies
var HtmlEvent = Framework.require('system/html/events/html-event/HtmlEvent.js');

// Class
var HtmlDocumentEvent = HtmlEvent.extend({

	

});

// Static methods

HtmlDocumentEvent.is = function(value) {
	return Class.isInstance(value, HtmlDocumentEvent);
};

// Export
module.exports = HtmlDocumentEvent;