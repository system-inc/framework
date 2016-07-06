// Dependencies
var MouseEvent = Framework.require('system/html/events/web-interface/MouseEvent.js');

// Class
var MouseWheelEvent = MouseEvent.extend({

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

MouseWheelEvent.is = function(value) {
	return Class.isInstance(value, MouseWheelEvent);
};

MouseWheelEvent.createEventsFromDomEvent = function(domEvent, emitter) {
	//Console.standardLog('MouseWheelEvent.createEventsFromDomEvent', domEvent.type, arguments);

	var events = [];

	// Use this for identifying which events to create
	var mouseWheelEventWithoutIdentifier = MouseWheelEvent.createFromDomEvent(domEvent, emitter, null);

	// The identifier for the event
	var eventIdentifier = null;

	eventIdentifier = 'mouse.wheel.rotate';

	// Set the identifier
	mouseWheelEventWithoutIdentifier.identifier = eventIdentifier;

	// Add the event
	events.append(mouseWheelEventWithoutIdentifier);

	// Scroll direction .up, .down, .left, .right
	if(mouseWheelEventWithoutIdentifier.direction) {
		events.append(MouseWheelEvent.createFromDomEvent(domEvent, emitter, eventIdentifier+'.'+mouseWheelEventWithoutIdentifier.direction));
	}

	//Console.standardLog('events', events);

	return events;
};

MouseWheelEvent.createFromDomEvent = function(domEvent, emitter, identifier) {
	var mouseWheelEvent = new MouseWheelEvent(emitter, identifier);

	MouseEvent.initializeFromDomEvent(mouseWheelEvent, domEvent);

	mouseWheelEvent.button = 3;

	mouseWheelEvent.delta.x = domEvent.deltaX;
	mouseWheelEvent.delta.y = domEvent.deltaY;
	mouseWheelEvent.delta.z = domEvent.deltaZ;

	if(domEvent.deltaMode == 0) {
		mouseWheelEvent.delta.mode = 'pixel';
	}
	else if(domEvent.deltaMode == 1) {
		mouseWheelEvent.delta.mode = 'line';
	}
	else if(domEvent.deltaMode == 2) {
		mouseWheelEvent.delta.mode = 'page';
	}

	mouseWheelEvent.wheelDelta.x = domEvent.wheelDeltaX;
	mouseWheelEvent.wheelDelta.y = domEvent.wheelDeltaY;

	if(mouseWheelEvent.wheelDelta.y !== 0 && mouseWheelEvent.wheelDelta.y < 0) {
		mouseWheelEvent.direction = 'down';
	}
	else if(mouseWheelEvent.wheelDelta.y !== 0 && mouseWheelEvent.wheelDelta.y > 0) {
		mouseWheelEvent.direction = 'up';
	}
	else if(mouseWheelEvent.wheelDelta.x !== 0 && mouseWheelEvent.wheelDelta.x > 0) {
		mouseWheelEvent.direction = 'right';
	}
	else if(mouseWheelEvent.wheelDelta.x !== 0 && mouseWheelEvent.wheelDelta.x < 0) {
		mouseWheelEvent.direction = 'left';
	}

	return mouseWheelEvent;
};

// Export
module.exports = MouseWheelEvent;