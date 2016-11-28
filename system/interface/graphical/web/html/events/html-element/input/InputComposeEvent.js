// Dependencies
import HtmlElementEvent from 'framework/system/interface/graphical/web/html/events/html-element/HtmlElementEvent.js';

// Class
class InputComposeEvent extends HtmlElementEvent {

	static is(value) {
		return Class.isInstance(value, InputComposeEvent);
	}

	static createEventsFromDomEvent(domEvent, emitter) {
		Console.standardLog('InputComposeEvent.createEventsFromDomEvent', domEvent.type, arguments);

		var events = [];

		// Use this for identifying which events to create
		var inputComposeEventWithoutIdentifier = InputComposeEvent.createFromDomEvent(domEvent, emitter, null);

		// The identifier for the event
		var eventIdentifier = null;

		if(domEvent.type == 'compositionstart') {
			eventIdentifier = 'input.compose.start';
		}
		else if(domEvent.type == 'compositionupdate') {
			eventIdentifier = 'input.compose.update';
		}
		else if(domEvent.type == 'compositionend') {
			eventIdentifier = 'input.compose.end';
		}

		// Set the identifier
		inputComposeEventWithoutIdentifier.identifier = eventIdentifier;

		// Add the event
		events.append(inputComposeEventWithoutIdentifier);

		//Console.standardLog('events', events);

		return events;
	}

	static createFromDomEvent(domEvent, emitter, identifier) {
		var inputComposeEvent = new InputComposeEvent(emitter, identifier);

		return inputComposeEvent;
	}

}

// Export
export default InputComposeEvent;
