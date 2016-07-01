// Dependencies
var PropagatingEventEmitter = Framework.require('system/events/PropagatingEventEmitter.js');
var HtmlEvent = Framework.require('system/html/events/HtmlEvent.js');
var HtmlEventProxy = Framework.require('system/html/events/HtmlEventProxy.js');
var MouseEvent = Framework.require('system/html/events/web-interface/MouseEvent.js');

// Class
var HtmlEventEmitter = PropagatingEventEmitter.extend({

	createEvent: function(emitter, eventIdentifier, data, eventOptions) {
		var event = new HtmlEvent(emitter, eventIdentifier, data, eventOptions);

		return event;
	},

	createEventFromDomEvent: function(domEvent, emitter, eventIdentifier, data, eventOptions) {
		var event = null;

		//Console.standardWarn('HtmlEventEmitter createEventFromDomEvent arguments', arguments);

		// MouseEvent
		if(window && window.MouseEvent && Class.isInstance(domEvent, window.MouseEvent)) {
			event = MouseEvent.createFromDomEvent(domEvent, emitter, eventIdentifier, data, eventOptions);
		}
		else {
			event = new HtmlEvent(emitter, eventIdentifier, data, eventOptions);	
		}		

		return event;
	},

	addEventListener: function(eventPattern, functionToBind, timesToRun) {
		// All events are routed through the HtmlEventProxy
		return HtmlEventProxy.addEventListener(eventPattern, functionToBind, timesToRun, this);
	},

});

// Static methods

HtmlEventEmitter.is = function(value) {
	return Class.isInstance(value, HtmlEventEmitter);
};

// Export
module.exports = HtmlEventEmitter;