// Dependencies
import PropagatingEventEmitter from 'framework/system/event/PropagatingEventEmitter.js';
import HtmlEvent from 'framework/system/interface/graphical/web/html/events/html-event/HtmlEvent.js';

// Class
class HtmlEventEmitter extends PropagatingEventEmitter {

	eventClass = HtmlEvent;
	eventListenersOnDomObject = {};

	addEventListener(eventPattern, functionToBind, timesToRun) {
		//console.info('HtmlEventEmitter addEventListener() ', eventPattern);

		var HtmlEventProxy = require('framework/system/interface/graphical/web/html/events/HtmlEventProxy.js').default;

		// All events are routed through the HtmlEventProxy
		return HtmlEventProxy.addEventListener(eventPattern, functionToBind, timesToRun, this);
	}

	removeEventListener(eventPattern, functionToUnbind) {
		var HtmlEventProxy = require('framework/system/interface/graphical/web/html/events/HtmlEventProxy.js').default;

		// Route this call through HtmlEventProxy
		return HtmlEventProxy.removeEventListener(eventPattern, functionToUnbind, this);
	}

	removeAllEventListeners() {
		var HtmlEventProxy = require('framework/system/interface/graphical/web/html/events/HtmlEventProxy.js').default;

		// Route this call through HtmlEventProxy
		return HtmlEventProxy.removeAllEventListeners(this);
	}

	static is(value) {
		var HtmlEventProxy = require('framework/system/interface/graphical/web/html/events/HtmlEventProxy.js').default;

		return Class.isInstance(value, HtmlEventEmitter);
	}

}

// Export
export default HtmlEventEmitter;
