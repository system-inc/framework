// Dependencies
import HtmlElementEvent from 'framework/system/interface/graphical/web/html/events/html-element/HtmlElementEvent.js';

// Class
class ClipboardEvent extends HtmlElementEvent {

	dataTransfer = null;

	static is(value) {
		return Class.isInstance(value, ClipboardEvent);
	}

	static createEventsFromDomEvent(domEvent, emitter) {
		Console.standardLog('ClipboardEvent.createEventsFromDomEvent', domEvent.type, arguments);

		var events = [];

		// Use this for identifying which events to create
		var clipboardEventWithoutIdentifier = ClipboardEvent.createFromDomEvent(domEvent, emitter, null);

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
	}

	static createFromDomEvent(domEvent, emitter, identifier) {
		var clipboardEvent = new ClipboardEvent(emitter, identifier);

		clipboardEvent.dataTransfer = domEvent.clipboardData;

		return clipboardEvent;
	}

}

// Export
export default ClipboardEvent;
