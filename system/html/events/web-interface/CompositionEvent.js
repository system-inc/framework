// Dependencies
var HtmlElementEvent = Framework.require('system/html/events/html-element/HtmlElementEvent.js');

// Class
var CompositionEvent = HtmlElementEvent.extend({

});

// Static methods

CompositionEvent.is = function(value) {
	return Class.isInstance(value, CompositionEvent);
};

CompositionEvent.createEventsFromDomEvent = function(domEvent, emitter, data, options) {
	Console.standardLog('CompositionEvent.createEventsFromDomEvent', domEvent.type, arguments);

	var events = [];

	// Use this for identifying which events to create
	var compositionEventWithoutIdentifier = CompositionEvent.createFromDomEvent(domEvent, emitter, null, data, options);

	// The identifier for the event
	var eventIdentifier = null;

	if(domEvent.type == 'compositionstart') {
		eventIdentifier = 'composition.start';
	}
	else if(domEvent.type == 'compositionupdate') {
		eventIdentifier = 'composition.update';
	}
	else if(domEvent.type == 'compositionend') {
		eventIdentifier = 'composition.end';
	}

	// Set the identifier
	compositionEventWithoutIdentifier.identifier = eventIdentifier;

	// Add the event
	events.append(compositionEventWithoutIdentifier);

	//Console.standardLog('events', events);

	return events;
};

CompositionEvent.createFromDomEvent = function(domEvent, emitter, identifier, data, options) {
	var compositionEvent = new CompositionEvent(emitter, identifier, data, options);

	return compositionEvent;
};

// Export
module.exports = CompositionEvent;