// Dependencies
var HtmlNodeEvent = Framework.require('system/html/events/html-node/HtmlNodeEvent.js');

// Class
var HtmlElementEvent = HtmlNodeEvent.extend({

	

});

// Static methods

HtmlElementEvent.is = function(value) {
	return Class.isInstance(value, HtmlElementEvent);
};

HtmlElementEvent.createEventsFromDomEvent = function(domEvent, emitter) {
	Console.standardLog('HtmlElementEvent.createEventsFromDomEvent', domEvent.type, arguments);

	var events = [];

	// Use this for identifying which events to create
	var htmlElementEventWithoutIdentifier = HtmlElementEvent.createFromDomEvent(domEvent, emitter, null);

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
	else if(domEvent.type == 'load') {
		eventIdentifier = 'htmlElement.load';
	}
	else if(domEvent.type == 'abort') {
		eventIdentifier = 'htmlElement.abort';
	}
	else if(domEvent.type == 'error') {
		eventIdentifier = 'htmlElement.error';
	}

	// Set the identifier
	htmlElementEventWithoutIdentifier.identifier = eventIdentifier;

	// Add the event
	events.append(htmlElementEventWithoutIdentifier);

	// If scrolling
	if(eventIdentifier == 'htmlElement.scroll') {
		//Console.standardInfo('emitter.position', emitter.position);

		// Check if the scroll is up or down and fire additional events

		// Scrolling up
		if(emitter.position.relativeToRelativeAncestor.y > emitter.domNode.scrollTop) {
			events.append(HtmlElementEvent.createFromDomEvent(domEvent, emitter, eventIdentifier+'.up'));
		}
		// Scrolling down
		else if(emitter.position.relativeToRelativeAncestor.y < emitter.domNode.scrollTop) {
			events.append(HtmlElementEvent.createFromDomEvent(domEvent, emitter, eventIdentifier+'.down'));
		}
		
		// Scrolling horizontally can happen at the same time as vertically, so we use another if statement instead of an else if

		// Scrolling left
		if(emitter.position.relativeToRelativeAncestor.x > emitter.domNode.scrollLeft) {
			events.append(HtmlElementEvent.createFromDomEvent(domEvent, emitter, eventIdentifier+'.left'));
		}
		// Scrolling right
		else if(emitter.position.relativeToRelativeAncestor.x < emitter.domNode.scrollLeft) {
			events.append(HtmlElementEvent.createFromDomEvent(domEvent, emitter, eventIdentifier+'.right'));
		}
		
		// Update the position relative to the relative ancestor
		emitter.position.relativeToRelativeAncestor.x = emitter.domNode.scrollLeft;
		emitter.position.relativeToRelativeAncestor.y = emitter.domNode.scrollTop;
	}

	//Console.standardLog('events', events);

	return events;
};

HtmlElementEvent.createFromDomEvent = function(domEvent, emitter, identifier) {
	var htmlElementEvent = new HtmlElementEvent(emitter, identifier);

	return htmlElementEvent;
};

// Export
module.exports = HtmlElementEvent;