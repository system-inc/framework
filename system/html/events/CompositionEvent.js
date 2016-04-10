// Dependencies
var HtmlEvent = Framework.require('system/html/events/HtmlEvent.js');

// Class
var CompositionEvent = HtmlEvent.extend({

	

});

// Static methods

CompositionEvent.is = function(value) {
	return Class.isInstance(value, CompositionEvent);
};

// Export
module.exports = CompositionEvent;