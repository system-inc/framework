// Dependencies
var PropagatingEventEmitter = Framework.require('system/events/PropagatingEventEmitter.js');
var HtmlEvent = Framework.require('system/html/events/HtmlEvent.js');

// Class
var HtmlEventEmitter = PropagatingEventEmitter.extend({

	createEvent: function(emitter, eventIdentifier, data, eventOptions) {
		var event = new HtmlEvent(emitter, eventIdentifier, data, eventOptions);

		return event;
	},

});

// Static methods

HtmlEventEmitter.is = function(value) {
	return Class.isInstance(value, HtmlEventEmitter);
};

// Export
module.exports = HtmlEventEmitter;