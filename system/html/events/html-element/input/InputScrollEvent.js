// Dependencies
var InputPressEvent = Framework.require('system/html/events/web-interface/InputPressEvent.js');

// Class
var InputScrollEvent = InputPressEvent.extend({

	direction: null,

	delta: {
		x: null,
		y: null,
		z: null,
		mode: null,
	},

	wheelDelta: {
		x: null,
		y: null,
	},

});

// Static methods

InputScrollEvent.is = function(value) {
	return Class.isInstance(value, InputScrollEvent);
};

InputScrollEvent.createEventsFromDomEvent = function(domEvent, emitter) {
	//Console.standardLog('InputScrollEvent.createEventsFromDomEvent', domEvent.type, arguments);

	var events = [];

	// Use this for identifying which events to create
	var inputScrollEventWithoutIdentifier = InputScrollEvent.createFromDomEvent(domEvent, emitter, null);

	// The identifier for the event
	var eventIdentifier = null;

	eventIdentifier = 'input.scroll';

	// Set the identifier
	inputScrollEventWithoutIdentifier.identifier = eventIdentifier;

	// Add the event
	events.append(inputScrollEventWithoutIdentifier);

	// Scroll direction .up, .down, .left, .right
	if(inputScrollEventWithoutIdentifier.direction) {
		events.append(InputScrollEvent.createFromDomEvent(domEvent, emitter, eventIdentifier+'.'+inputScrollEventWithoutIdentifier.direction));
	}

	//Console.standardLog('events', events);

	return events;
};

InputScrollEvent.createFromDomEvent = function(domEvent, emitter, identifier) {
	var inputScrollEvent = new InputScrollEvent(emitter, identifier);

	InputPressEvent.initializeFromDomEvent(inputScrollEvent, domEvent);

	inputScrollEvent.button = 3;

	inputScrollEvent.delta.x = domEvent.deltaX;
	inputScrollEvent.delta.y = domEvent.deltaY;
	inputScrollEvent.delta.z = domEvent.deltaZ;

	if(domEvent.deltaMode == 0) {
		inputScrollEvent.delta.mode = 'pixel';
	}
	else if(domEvent.deltaMode == 1) {
		inputScrollEvent.delta.mode = 'line';
	}
	else if(domEvent.deltaMode == 2) {
		inputScrollEvent.delta.mode = 'page';
	}

	inputScrollEvent.wheelDelta.x = domEvent.wheelDeltaX;
	inputScrollEvent.wheelDelta.y = domEvent.wheelDeltaY;

	if(inputScrollEvent.wheelDelta.y !== 0 && inputScrollEvent.wheelDelta.y < 0) {
		inputScrollEvent.direction = 'down';
	}
	else if(inputScrollEvent.wheelDelta.y !== 0 && inputScrollEvent.wheelDelta.y > 0) {
		inputScrollEvent.direction = 'up';
	}
	else if(inputScrollEvent.wheelDelta.x !== 0 && inputScrollEvent.wheelDelta.x > 0) {
		inputScrollEvent.direction = 'right';
	}
	else if(inputScrollEvent.wheelDelta.x !== 0 && inputScrollEvent.wheelDelta.x < 0) {
		inputScrollEvent.direction = 'left';
	}

	return inputScrollEvent;
};

// Export
module.exports = InputScrollEvent;