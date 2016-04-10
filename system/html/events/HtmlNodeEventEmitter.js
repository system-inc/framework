// Dependencies
var HtmlEventEmitter = Framework.require('system/html/events/HtmlEventEmitter.js');
var HtmlNodeEvent = Framework.require('system/html/events/HtmlNodeEvent.js');
var HtmlEventProxy = Framework.require('system/html/events/HtmlEventProxy.js');

// Class
var HtmlNodeEventEmitter = HtmlEventEmitter.extend({

	createEvent: function(emitter, eventIdentifier, data, eventOptions) {
		var event = new HtmlNodeEvent(emitter, eventIdentifier, data, eventOptions);

		return event;
	},

	addEventListener: function(eventPattern, functionToBind, timesToRun) {
		return HtmlEventProxy.addEventListener(eventPattern, functionToBind, timesToRun, this);
	},

});

// Static methods

HtmlNodeEventEmitter.is = function(value) {
	return Class.isInstance(value, HtmlNodeEventEmitter);
};

// Export
module.exports = HtmlNodeEventEmitter;