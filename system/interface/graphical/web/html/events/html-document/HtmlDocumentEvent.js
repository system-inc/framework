// Dependencies
import HtmlEvent from 'framework/system/interface/graphical/web/html/events/html-event/HtmlEvent.js';
import Url from 'framework/system/web/Url.js';

// Class
class HtmlDocumentEvent extends HtmlEvent {

	static is(value) {
		return Class.isInstance(value, HtmlDocumentEvent);
	}

	static createEventsFromDomEvent(domEvent, emitter) {
		//console.log('HtmlDocumentEvent.createEventsFromDomEvent', domEvent.type, arguments);

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

			emitter.calculateDimensionsAndPosition();
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

		//console.warn('HtmlDocumentEvent.createEventsFromDomEvent events', events);

		return events;
	}

	static createFromDomEvent(domEvent, emitter, identifier) {
		var htmlDocumentEvent = new HtmlDocumentEvent(emitter, identifier);

		return htmlDocumentEvent;
	}

}

// Export
export default HtmlDocumentEvent;
