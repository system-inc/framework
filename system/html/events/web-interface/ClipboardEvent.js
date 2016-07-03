// Dependencies
var HtmlEvent = Framework.require('system/html/events/HtmlEvent.js');

// Class
var ClipboardEvent = HtmlEvent.extend({

	dataTransfer: null,

});

// Static methods

ClipboardEvent.is = function(value) {
	return Class.isInstance(value, ClipboardEvent);
};

ClipboardEvent.createEventsFromDomEvent = function(domEvent, emitter, data, options) {
	Console.standardLog('ClipboardEvent.createEventsFromDomEvent', domEvent.type, arguments);

	var events = [];

	// Use this for identifying which events to create
	var clipboardEventWithoutIdentifier = ClipboardEvent.createFromDomEvent(domEvent, emitter, null, data, options);

	// The identifier for the event
	var eventIdentifier = null;

	if(domEvent.type == 'copy') {
		eventIdentifier = 'clipboard.copy';
	}
	else if(domEvent.type == 'cut') {
		eventIdentifier = 'clipboard.cut';
	}
	else if(domEvent.type == 'paste') {
		eventIdentifier = 'clipboard.paste';
	}

	// Set the identifier
	clipboardEventWithoutIdentifier.identifier = eventIdentifier;

	// Add the event
	events.append(clipboardEventWithoutIdentifier);

	//Console.standardLog('events', events);

	return events;
};

ClipboardEvent.createFromDomEvent = function(domEvent, emitter, identifier, data, options) {
	var clipboardEvent = new ClipboardEvent(emitter, identifier, data, options);

	clipboardEvent.dataTransfer = domEvent.clipboardData;

	return clipboardEvent;
};

// Export
module.exports = ClipboardEvent;