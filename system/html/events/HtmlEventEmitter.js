// Dependencies
var PropagatingEventEmitter = Framework.require('system/events/PropagatingEventEmitter.js');
var HtmlEvent = Framework.require('system/html/events/HtmlEvent.js');
var HtmlEventProxy = Framework.require('system/html/events/HtmlEventProxy.js');
var MouseEvent = Framework.require('system/html/events/web-interface/MouseEvent.js');
var KeyboardEvent = Framework.require('system/html/events/web-interface/KeyboardEvent.js');
var FormEvent = Framework.require('system/html/events/web-interface/FormEvent.js');

// Class
var HtmlEventEmitter = PropagatingEventEmitter.extend({

	createEvent: function(emitter, eventIdentifier, data, eventOptions) {
		var event = new HtmlEvent(emitter, eventIdentifier, data, eventOptions);

		return event;
	},

	createEventsFromDomEvent: function(domEvent, emitter, data, eventOptions) {
		//Console.standardWarn('HtmlEventEmitter createEventFromDomEvent arguments', arguments);

		var events = [];

		// Set the proper source emitter
		// For example, if you listen to "form.control.change" events on a form element and you catch the DOM event "change" event passed from
		// an input element, the emitter here would be the form when it actually needs to be the input element
		var sourceEmitter = domEvent.target.htmlNode;
		// Don't even do this check for now, wait and see until the line above breaks
		//if(domEvent.target && domEvent.target.htmlNode) {
		//	sourceEmitter = domEvent.target.htmlNode;
		//}

		// MouseEvent
		if(window && window.MouseEvent && Class.isInstance(domEvent, window.MouseEvent)) {
			events = MouseEvent.createEventsFromDomEvent(domEvent, sourceEmitter, data, eventOptions);
		}
		// KeyboardEvent
		else if(window && (window.KeyboardEvent && Class.isInstance(domEvent, window.KeyboardEvent) || domEvent.keyCode != undefined)) {
			events = KeyboardEvent.createEventsFromDomEvent(domEvent, sourceEmitter, data, eventOptions);
		}
		// FormEvent
		else if(domEvent.type == 'change' || domEvent.type == 'submit') {
			events = FormEvent.createEventsFromDomEvent(domEvent, sourceEmitter, data, eventOptions);
		}
		// All other events
		else {
			event.append(this.createEvent(sourceEmitter, domEvent.type, data, eventOptions));
		}

		// Set the common HtmlEvent properties
		events.each(function(eventIndex, event) {
			// Do not allow the custom event to bubble, rather, the domEvent will bubble and custom events will be created as it bubbles
			event.stopPropagation();

			event.domEvent = domEvent;
			event.trusted = domEvent.isTrusted;
		});

		Console.standardWarn('HtmlEventEmitter createEventFromDomEvent events', events);

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