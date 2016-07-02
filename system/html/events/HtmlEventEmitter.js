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

	createEventsFromDomEvent: function(domEvent, emitter, data, eventOptions) {
		//Console.standardWarn('HtmlEventEmitter createEventFromDomEvent arguments', arguments);

		var events = [];

		// MouseEvent
		if(window && window.MouseEvent && Class.isInstance(domEvent, window.MouseEvent)) {
			events = MouseEvent.createEventsFromDomEvent(domEvent, emitter, data, eventOptions);
		}
		// All other events
		else {
			events.append(new HtmlEvent(emitter, domEvent.type, data, eventOptions));
		}

		// Set the common HtmlEvent properties
		events.each(function(eventIndex, event) {
			event.domEvent = domEvent;
			event.trusted = domEvent.isTrusted;
		});

		//Console.standardWarn('HtmlEventEmitter createEventFromDomEvent events', events);

		return events;
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