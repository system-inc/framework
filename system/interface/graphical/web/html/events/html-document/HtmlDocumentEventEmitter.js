// Dependencies
import HtmlEventEmitter from './../html-event/HtmlEventEmitter.js';
import HtmlDocumentEvent from './HtmlDocumentEvent.js';

// Class
class HtmlDocumentEventEmitter extends HtmlEventEmitter {

	eventClass = HtmlDocumentEvent;

	addEventListener(eventPattern, functionToBind, timesToRun) {
		// Special case for htmlDocument.ready
		if(eventPattern == 'htmlDocument.ready') {
			// If the document is already ready, just run the function
			if(this.domDocument && (this.domDocument.readyState == 'interactive' || this.domDocument.readyState == 'complete')) {
				functionToBind();
			}
		}
		// Special case for htmlDocument.loaded
		else if(eventPattern == 'htmlDocument.loaded') {
			// If the document is already loaded, just run the function
			if(this.domDocument && this.domDocument.readyState == 'complete') {
				functionToBind();
			}
		}
		
		// Add the event listener
		return super.addEventListener(...arguments);
	}

	static is(value) {
		return Class.isInstance(value, HtmlDocumentEventEmitter);
	}

}

// Export
export default HtmlDocumentEventEmitter;
