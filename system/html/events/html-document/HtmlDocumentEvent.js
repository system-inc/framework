// Dependencies
var HtmlEvent = Framework.require('system/html/events/html-event/HtmlEvent.js');
var Url = Framework.require('system/web/Url.js');

// Class
var HtmlDocumentEvent = HtmlEvent.extend({

	

});

// Static methods

HtmlDocumentEvent.is = function(value) {
	return Class.isInstance(value, HtmlDocumentEvent);
};

HtmlDocumentEvent.createEventsFromDomEvent = function(domEvent, emitter) {
	//Console.standardLog('HtmlDocumentEvent.createEventsFromDomEvent', domEvent.type, arguments);

	var events = [];

	// Use this for identifying which events to create
	var htmlDocumentEventWithoutIdentifier = HtmlDocumentEvent.createFromDomEvent(domEvent, emitter, null);

	// The identifier for the event
	var eventIdentifier = null;

	if(domEvent.type == 'readystatechange') {
		if(emitter.domDocument.readyState == 'loading') {
			eventIdentifier = 'htmlDocument.loading';
		}
		else if(emitter.domDocument.readyState == 'interactive') {
			eventIdentifier = 'htmlDocument.ready';
		}
		else if(emitter.domDocument.readyState == 'complete') {
			eventIdentifier = 'htmlDocument.load';
		}
	}
	else if(domEvent.type == 'hashchange') {
		eventIdentifier = 'htmlDocument.url.fragment.change';

		// Update the URL on the document
		emitter.url = new Url(domEvent.newURL);

		htmlDocumentEventWithoutIdentifier.data = emitter.url;
	}
	else if(domEvent.type == 'beforeunload') {
		eventIdentifier = 'htmlDocument.unload.before';
	}
	else if(domEvent.type == 'resize') {
		eventIdentifier = 'htmlDocument.resize';

		emitter.getDimensionAndPositionFromDomDocument();
	}
	else if(domEvent.type == 'webkitfullscreenchange') {
		if(emitter.domDocument.webkitIsFullScreen) {
			eventIdentifier = 'htmlDocument.fullScreen';
		}
		else {
			eventIdentifier = 'htmlDocument.fullScreen.exit';
		}
	}
	else if(domEvent.type == 'webkitfullscreenerror') {
		eventIdentifier = 'htmlDocument.fullScreen.error';
	}

	// Set the identifier
	htmlDocumentEventWithoutIdentifier.identifier = eventIdentifier;

	// Add the event
	events.append(htmlDocumentEventWithoutIdentifier);

	//Console.standardWarn('HtmlDocumentEvent.createEventsFromDomEvent events', events);

	return events;
};

HtmlDocumentEvent.createFromDomEvent = function(domEvent, emitter, identifier) {
	var htmlDocumentEvent = new HtmlDocumentEvent(emitter, identifier);

	return htmlDocumentEvent;
};

// Export
module.exports = HtmlDocumentEvent;