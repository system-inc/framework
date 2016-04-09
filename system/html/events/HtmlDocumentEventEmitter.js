// Dependencies
var HtmlEventEmitter = Framework.require('system/html/events/HtmlEventEmitter.js');
var HtmlDocumentEvent = Framework.require('system/html/events/HtmlDocumentEvent.js');

// Class
var HtmlDocumentEventEmitter = HtmlEventEmitter.extend({

	createEvent: function(emitter, eventIdentifier, data, eventOptions) {
		var event = new HtmlDocumentEvent(emitter, eventIdentifier, data, eventOptions);

		return event;
	},

});

// Static methods

HtmlDocumentEventEmitter.is = function(value) {
	return Class.isInstance(value, HtmlDocumentEventEmitter);
};

// Export
module.exports = HtmlDocumentEventEmitter;