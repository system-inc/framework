// Dependencies
import HtmlElementEvent from 'framework/system/interface/graphical/web/html/events/html-element/HtmlElementEvent.js';

// Class
class FormEvent extends HtmlElementEvent{

	static is = function(value) {
		return Class.isInstance(value, FormEvent);
	}

	static createEventsFromDomEvent(domEvent, emitter) {
		//Console.standardLog('FormEvent.createEventsFromDomEvent', domEvent.type, arguments);

		var events = [];

		// Use this for identifying which events to create
		var formEventWithoutIdentifier = FormEvent.createFromDomEvent(domEvent, emitter, null);

		// The identifier for the event
		var eventIdentifier = null;

		if(domEvent.type == 'change' || domEvent.type == 'input') {
			eventIdentifier = 'form.control.change';
		}
		else if(domEvent.type == 'submit') {
			eventIdentifier = 'form.submit';
		}

		// Set the identifier
		formEventWithoutIdentifier.identifier = eventIdentifier;

		// Add the event
		events.append(formEventWithoutIdentifier);

		//Console.standardLog('events', events);

		return events;
	}

	static createFromDomEvent(domEvent, emitter, identifier) {
		var formEvent = new FormEvent(emitter, identifier);

		return formEvent;
	}

}

// Export
export default FormEvent;
