// Dependencies
var HtmlElementEvent = Framework.require('system/html/events/html-element/HtmlElementEvent.js');

// Class
var SelectionEvent = HtmlElementEvent.extend({

	selection: null,
	text: null,

});

// Static methods

SelectionEvent.is = function(value) {
	return Class.isInstance(value, SelectionEvent);
};

SelectionEvent.createEventsFromDomEvent = function(domEvent, emitter) {
	Console.standardLog('SelectionEvent.createEventsFromDomEvent', domEvent.type, arguments);

	var events = [];

	// Use this for identifying which events to create
	var selectionEventWithoutIdentifier = SelectionEvent.createFromDomEvent(domEvent, emitter, null);

	// The identifier for the event
	var eventIdentifier = null;

	if(domEvent.type == 'select') {
		eventIdentifier = 'selection.end';
	}
	else if(domEvent.type == 'selectstart') {
		eventIdentifier = 'selection.start';
	}
	else if(domEvent.type == 'selectionchange') {
		eventIdentifier = 'selection.change';
	}

	// Set the identifier
	selectionEventWithoutIdentifier.identifier = eventIdentifier;

	// Add the event
	events.append(selectionEventWithoutIdentifier);

	//Console.standardLog('events', events);

	return events;
};

SelectionEvent.createFromDomEvent = function(domEvent, emitter, identifier) {
	var selectionEvent = new SelectionEvent(emitter, identifier);

	selectionEvent.selection = window.getSelection();
	selectionEvent.text = selectionEvent.selection.toString();

	return selectionEvent;
};

// Export
module.exports = SelectionEvent;