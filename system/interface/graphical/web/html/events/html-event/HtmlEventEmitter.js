// Dependencies
import PropagatingEventEmitter from 'framework/system/event/PropagatingEventEmitter.js';
import HtmlEvent from 'framework/system/interface/graphical/web/html/events/html-event/HtmlEvent.js';
import HtmlEventProxy from 'framework/system/interface/graphical/web/html/events/HtmlEventProxy.js';

// Class
class HtmlEventEmitter extends PropagatingEventEmitter {

	eventClass = HtmlEvent;
	eventListenersOnDomObject = {};

	addEventListener(eventPattern, functionToBind, timesToRun) {
		//console.info('HtmlEventEmitter addEventListener() ', eventPattern);

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
