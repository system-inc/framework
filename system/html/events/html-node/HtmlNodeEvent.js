// Dependencies
var HtmlEvent = Framework.require('system/html/events/HtmlEvent.js');

// Class
var HtmlNodeEvent = HtmlEvent.extend({

	

});

// Static methods

HtmlNodeEvent.is = function(value) {
	return Class.isInstance(value, HtmlNodeEvent);
};

// Export
module.exports = HtmlNodeEvent;