// Dependencies
import PropagatingEventEmitter from './../../../../system/events/PropagatingEventEmitter.js';
import HtmlEvent from './HtmlEvent.js';
import HtmlEventProxy from './../HtmlEventProxy.js';

// Class
class HtmlEventEmitter extends PropagatingEventEmitter {

	eventClass = HtmlEvent;
	eventListenersOnDomObject = {};

	addEventListener(eventPattern, functionToBind, timesToRun) {
		// All events are routed through the HtmlEventProxy
		return HtmlEventProxy.addEventListener(eventPattern, functionToBind, timesToRun, this);
	}

	removeEventListener(eventPattern, functionToUnbind) {
		// Route this call through HtmlEventProxy
		return HtmlEventProxy.removeEventListener(eventPattern, functionToUnbind, this);
	}

	removeAllEventListeners() {
		// Route this call through HtmlEventProxy
		return HtmlEventProxy.removeAllEventListeners(this);
	}

	static is(value) {
		return Class.isInstance(value, HtmlEventEmitter);
	}

}

// Export
export default HtmlEventEmitter;
