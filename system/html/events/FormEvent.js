// Dependencies
var HtmlEvent = Framework.require('system/html/events/HtmlEvent.js');

// Class
var FormEvent = HtmlEvent.extend({

	

});

// Static methods

FormEvent.is = function(value) {
	return Class.isInstance(value, FormEvent);
};

// Export
module.exports = FormEvent;