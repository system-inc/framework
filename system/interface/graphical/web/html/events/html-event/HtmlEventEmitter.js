// Dependencies
import PropagatingEventEmitter from 'system/events/PropagatingEventEmitter.js';
import HtmlEvent from './HtmlEvent.js';

// Class
class HtmlEventEmitter extends PropagatingEventEmitter {

	eventClass = HtmlEvent;
	eventListenersOnDomObject = {};

	addEventListener(eventPattern, functionToBind, timesToRun) {
		var HtmlEventProxy = require('./../HtmlEventProxy.js').default;

		// All events are routed through the HtmlEventProxy
		return HtmlEventProxy.addEventListener(eventPattern, functionToBind, timesToRun, this);
	}

	removeEventListener(eventPattern, functionToUnbind) {
		var HtmlEventProxy = require('./../HtmlEventProxy.js').default;

		// Route this call through HtmlEventProxy
		return HtmlEventProxy.removeEventListener(eventPattern, functionToUnbind, this);
	}

	removeAllEventListeners() {
		var HtmlEventProxy = require('./../HtmlEventProxy.js').default;

		// Route this call through HtmlEventProxy
		return HtmlEventProxy.removeAllEventListeners(this);
	}

	static is(value) {
		var HtmlEventProxy = require('./../HtmlEventProxy.js').default;

		return Class.isInstance(value, HtmlEventEmitter);
	}

}

// Export
export default HtmlEventEmitter;
