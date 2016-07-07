// Dependencies
var InputPressEvent = Framework.require('system/html/events/html-element/input/InputPressEvent.js');

// Class
var InputHoverEvent = InputPressEvent.extend({

});

// Static methods

InputHoverEvent.is = function(value) {
	return Class.isInstance(value, InputHoverEvent);
};

InputHoverEvent.createEventsFromDomEvent = function(domEvent, emitter) {
	//Console.standardLog('InputHoverEvent.createEventsFromDomEvent', domEvent.type, arguments);

	var events = [];

	// Use this for identifying which events to create
	var inputHoverEventWithoutIdentifier = InputHoverEvent.createFromDomEvent(domEvent, emitter, null);

	// The identifier for the event
	var eventIdentifier = null;

	if(domEvent.type == 'mousemove') {
		eventIdentifier = 'input.hover';
	}
	if(domEvent.type == 'mouseenter') {
		eventIdentifier = 'input.hover.in';
	}
	if(domEvent.type == 'mouseleave') {
		eventIdentifier = 'input.hover.out';
	}
	if(domEvent.type == 'mouseover') {
		eventIdentifier = 'input.hover.in.exact';
	}
	if(domEvent.type == 'mouseout') {
		eventIdentifier = 'input.hover.out.exact';
	}

	// Set the identifier
	inputHoverEventWithoutIdentifier.identifier = eventIdentifier;

	// Add the event
	events.append(inputHoverEventWithoutIdentifier);

	// Scroll direction .up, .down, .left, .right
	if(inputHoverEventWithoutIdentifier.direction) {
		events.append(InputHoverEvent.createFromDomEvent(domEvent, emitter, eventIdentifier+'.'+inputHoverEventWithoutIdentifier.direction));
	}

	//Console.standardLog('events', events);

	return events;
};

InputHoverEvent.createFromDomEvent = function(domEvent, emitter, identifier) {
	var inputHoverEvent = new InputHoverEvent(emitter, identifier);

	InputPressEvent.initializeFromDomEvent(inputHoverEvent, domEvent);

	inputHoverEvent.button = null;

	return inputHoverEvent;
};

// Export
module.exports = InputHoverEvent;