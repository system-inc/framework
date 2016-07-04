// Dependencies
var HtmlNodeEvent = Framework.require('system/html/events/html-node/HtmlNodeEvent.js');

// Class
var HtmlElementEvent = HtmlNodeEvent.extend({

	

});

// Static methods

HtmlElementEvent.is = function(value) {
	return Class.isInstance(value, HtmlElementEvent);
};

HtmlElementEvent.createEventsFromDomEvent = function(domEvent, emitter, data, options) {
	Console.standardLog('HtmlElementEvent.createEventsFromDomEvent', domEvent.type, arguments);

	var events = [];

	// Use this for identifying which events to create
	var htmlElementEventWithoutIdentifier = HtmlElementEvent.createFromDomEvent(domEvent, emitter, null, data, options);

	// The identifier for the event
	var eventIdentifier = null;

	if(domEvent.type == 'focusin') {
		eventIdentifier = 'htmlElement.focus';
	}
	else if(domEvent.type == 'focusout') {
		eventIdentifier = 'htmlElement.blur';
	}
	else if(domEvent.type == 'scroll') {
		eventIdentifier = 'htmlElement.scroll';
	}

	// Set the identifier
	htmlElementEventWithoutIdentifier.identifier = eventIdentifier;

	// Add the event
	events.append(htmlElementEventWithoutIdentifier);

	// If scrolling
	if(eventIdentifier == 'htmlElement.scroll') {
		// Check if the scroll is up or down and fire additional events	
		HtmlElementEvent.createFromDomEvent(domEvent, emitter, null, data, options);
	}

	//Console.standardLog('events', events);

	return events;
};

HtmlElementEvent.createFromDomEvent = function(domEvent, emitter, identifier, data, options) {
	var htmlElementEvent = new HtmlElementEvent(emitter, identifier, data, options);

	return htmlElementEvent;
};

// Export
module.exports = HtmlElementEvent;