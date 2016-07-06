// Dependencies
var HtmlElementEvent = Framework.require('system/html/events/html-element/HtmlElementEvent.js');

// Class
var FormEvent = HtmlElementEvent.extend({

	

});

// Static methods

FormEvent.is = function(value) {
	return Class.isInstance(value, FormEvent);
};

FormEvent.createEventsFromDomEvent = function(domEvent, emitter) {
	//Console.standardLog('FormEvent.createEventsFromDomEvent', domEvent.type, arguments);

	var events = [];

	// Use this for identifying which events to create
	var formEventWithoutIdentifier = FormEvent.createFromDomEvent(domEvent, emitter, null);

	// The identifier for the event
	var eventIdentifier = null;

	if(domEvent.type == 'change' || domEvent.type == 'input') {
		eventIdentifier = 'form.control.change';
	}
	else if(domEvent.type == 'submit') {
		eventIdentifier = 'form.submit';
	}

	// Set the identifier
	formEventWithoutIdentifier.identifier = eventIdentifier;

	// Add the event
	events.append(formEventWithoutIdentifier);

	//Console.standardLog('events', events);

	return events;
};

FormEvent.createFromDomEvent = function(domEvent, emitter, identifier) {
	var formEvent = new FormEvent(emitter, identifier);

	return formEvent;
};

// Export
module.exports = FormEvent;