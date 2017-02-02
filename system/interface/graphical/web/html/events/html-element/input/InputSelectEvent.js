// Dependencies
import HtmlElementEvent from 'framework/system/interface/graphical/web/html/events/html-element/HtmlElementEvent.js';

// Class
class InputSelectEvent extends HtmlElementEvent {

	selection = null;
	text = null;

	static is(value) {
		return Class.isInstance(value, InputSelectEvent);
	}

	static createEventsFromDomEvent(domEvent, emitter) {
		//console.log('InputSelectEvent.createEventsFromDomEvent', domEvent.type, arguments);

		var events = [];

		// Use this for identifying which events to create
		var inputSelectEventWithoutIdentifier = InputSelectEvent.createFromDomEvent(domEvent, emitter, null);

		// The identifier for the event
		var eventIdentifier = null;

		if(domEvent.type == 'select') {
			eventIdentifier = 'input.select';
		}
		else if(domEvent.type == 'selectstart') {
			eventIdentifier = 'input.select.start';
		}
		else if(domEvent.type == 'selectionchange') {
			eventIdentifier = 'input.select.change';
		}

		// Set the identifier
		inputSelectEventWithoutIdentifier.identifier = eventIdentifier;

		// Add the event
		events.append(inputSelectEventWithoutIdentifier);

		//console.log('events', events);

		return events;
	}

	static createFromDomEvent(domEvent, emitter, identifier) {
		var inputSelectEvent = new InputSelectEvent(emitter, identifier);

		// The emitter is an HtmlDocument
		if(emitter.getSelection) {
			inputSelectEvent.selection = emitter.getSelection();
		}
		// The emitter is an HtmlNode
		else if(emitter.htmlDocument) {
			inputSelectEvent.selection = emitter.htmlDocument.getSelection();
		}	

		inputSelectEvent.text = inputSelectEvent.selection.toString();

		return inputSelectEvent;
	}

}

// Export
export default InputSelectEvent;
