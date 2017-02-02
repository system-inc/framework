// Dependencies
import InputPressEvent from 'framework/system/interface/graphical/web/html/events/html-element/input/InputPressEvent.js';

// Class
class InputScrollEvent extends InputPressEvent {

	direction = null;

	delta = {
		x: null,
		y: null,
		z: null,
		mode: null,
	};

	wheelDelta = {
		x: null,
		y: null,
	};

	static is(value) {
		return Class.isInstance(value, InputScrollEvent);
	}

	static createEventsFromDomEvent(domEvent, emitter) {
		//console.log('InputScrollEvent.createEventsFromDomEvent', domEvent.type, arguments);

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

		//console.log('events', events);

		return events;
	}

	static createFromDomEvent(domEvent, emitter, identifier) {
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
			inputScrollEvent.direction = 'left';
		}
		else if(inputScrollEvent.wheelDelta.x !== 0 && inputScrollEvent.wheelDelta.x < 0) {
			inputScrollEvent.direction = 'right';
		}

		return inputScrollEvent;
	}

}

// Export
export default InputScrollEvent;
