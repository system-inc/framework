// Dependencies
import HtmlNodeEvent from 'framework/system/interface/graphical/web/html/events/html-node/HtmlNodeEvent.js';

// Class
class HtmlElementEvent extends HtmlNodeEvent {

	static is(value) {
		return Class.isInstance(value, HtmlElementEvent);
	}

	static createEventsFromDomEvent(domEvent, emitter) {
		console.log('HtmlElementEvent.createEventsFromDomEvent', domEvent.type, arguments);

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
		else if(domEvent.type == 'load') {
			eventIdentifier = 'htmlElement.load';
		}
		else if(domEvent.type == 'abort') {
			eventIdentifier = 'htmlElement.abort';
		}
		else if(domEvent.type == 'error') {
			eventIdentifier = 'htmlElement.error';
		}
		else if(domEvent.type == 'scroll') {
			if(domEvent.target == document) {
				eventIdentifier = 'htmlDocument.scroll';
			}
			else {
				eventIdentifier = 'htmlElement.scroll';
			}
		}

		// Set the identifier
		htmlElementEventWithoutIdentifier.identifier = eventIdentifier;

		// Add the event
		events.append(htmlElementEventWithoutIdentifier);

		// If scrolling
		if(eventIdentifier == 'htmlElement.scroll' || eventIdentifier == 'htmlDocument.scroll') {
			//console.info('emitter.position', emitter.position);

			// Identify the scrolling element
			var scrollingElement = null;
			if(eventIdentifier == 'htmlElement.scroll') {
				scrollingElement = emitter.domNode;
			}
			else if(eventIdentifier == 'htmlDocument.scroll') {
				scrollingElement = emitter.domDocument.scrollingElement;
			}

			// Check if the scroll is up or down and fire additional events

			// Scrolling up
			if(emitter.position.relativeToRelativeAncestor.y > scrollingElement.scrollTop) {
				events.append(HtmlElementEvent.createFromDomEvent(domEvent, emitter, eventIdentifier+'.up'));
			}
			// Scrolling down
			else if(emitter.position.relativeToRelativeAncestor.y < scrollingElement.scrollTop) {
				events.append(HtmlElementEvent.createFromDomEvent(domEvent, emitter, eventIdentifier+'.down'));
			}
			
			// Scrolling horizontally can happen at the same time as vertically, so we use another if statement instead of an else if

			// Scrolling left
			if(emitter.position.relativeToRelativeAncestor.x > scrollingElement.scrollLeft) {
				events.append(HtmlElementEvent.createFromDomEvent(domEvent, emitter, eventIdentifier+'.left'));
			}
			// Scrolling right
			else if(emitter.position.relativeToRelativeAncestor.x < scrollingElement.scrollLeft) {
				events.append(HtmlElementEvent.createFromDomEvent(domEvent, emitter, eventIdentifier+'.right'));
			}
			
			// Update the position relative to the relative ancestor
			emitter.position.relativeToRelativeAncestor.x = scrollingElement.scrollLeft;
			emitter.position.relativeToRelativeAncestor.y = scrollingElement.scrollTop;
		}

		//console.log('events', events);

		return events;
	}

	static createFromDomEvent(domEvent, emitter, identifier) {
		var htmlElementEvent = new HtmlElementEvent(emitter, identifier);

		return htmlElementEvent;
	}

}


// Export
export default HtmlElementEvent;
