// Dependencies
var HtmlElementEvent = Framework.require('system/html/events/html-element/HtmlElementEvent.js');

// Class
var InputSelectEvent = HtmlElementEvent.extend({

	selection: null,
	text: null,

});

// Static methods

InputSelectEvent.is = function(value) {
	return Class.isInstance(value, InputSelectEvent);
};

InputSelectEvent.createEventsFromDomEvent = function(domEvent, emitter) {
	Console.standardLog('InputSelectEvent.createEventsFromDomEvent', domEvent.type, arguments);

	var events = [];

	// Use this for identifying which events to create
	var inputSelectEventWithoutIdentifier = InputSelectEvent.createFromDomEvent(domEvent, emitter, null);

	// The identifier for the event
	var eventIdentifier = null;

	if(domEvent.type == 'select') {
		eventIdentifier = 'input.select';
	}
	else if(domEvent.type == 'selectstart') {
		eventIdentifier = 'input.select.start';
	}
	else if(domEvent.type == 'selectionchange') {
		eventIdentifier = 'input.select.change';
	}

	// Set the identifier
	inputSelectEventWithoutIdentifier.identifier = eventIdentifier;

	// Add the event
	events.append(inputSelectEventWithoutIdentifier);

	//Console.standardLog('events', events);

	return events;
};

InputSelectEvent.createFromDomEvent = function(domEvent, emitter, identifier) {
	var inputSelectEvent = new InputSelectEvent(emitter, identifier);

	inputSelectEvent.selection = window.getSelection();
	inputSelectEvent.text = inputSelectEvent.selection.toString();

	return inputSelectEvent;
};

// Export
module.exports = InputSelectEvent;