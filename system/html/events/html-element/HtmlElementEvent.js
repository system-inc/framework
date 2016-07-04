// Dependencies
var HtmlNodeEvent = Framework.require('system/html/events/html-node/HtmlNodeEvent.js');

// Class
var HtmlElementEvent = HtmlNodeEvent.extend({

	

});

// Static methods

HtmlElementEvent.is = function(value) {
	return Class.isInstance(value, HtmlElementEvent);
};

// Export
module.exports = HtmlElementEvent;