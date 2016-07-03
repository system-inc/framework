// Dependencies
var HtmlEvent = Framework.require('system/html/events/HtmlEvent.js');

// Class
var FormEvent = HtmlEvent.extend({

	

});

// Static methods

FormEvent.is = function(value) {
	return Class.isInstance(value, FormEvent);
};

FormEvent.createEventsFromDomEvent = function(domEvent, emitter, data, options) {
	//Console.standardLog('FormEvent.createEventsFromDomEvent', domEvent.type, arguments);

	var events = [];

	// Use this for identifying which events to create
	var formEventWithoutIdentifier = FormEvent.createFromDomEvent(domEvent, emitter, null, data, options);

	// The identifier for the event
	var eventIdentifier = null;

	if(domEvent.type == 'change') {
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

FormEvent.createFromDomEvent = function(domEvent, emitter, identifier, data, options) {
	var formEvent = new FormEvent(emitter, identifier, data, options);

	return formEvent;
};

// Export
module.exports = FormEvent;