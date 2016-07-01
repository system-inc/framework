// Dependencies
var HtmlEvent = Framework.require('system/html/events/HtmlEvent.js');

// Class
var SelectionEvent = HtmlEvent.extend({

	

});

// Static methods

SelectionEvent.is = function(value) {
	return Class.isInstance(value, SelectionEvent);
};

// Export
module.exports = SelectionEvent;