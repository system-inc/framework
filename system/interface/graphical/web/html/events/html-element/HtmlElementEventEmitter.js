// Dependencies
import HtmlNodeEventEmitter from 'framework/system/interface/graphical/web/html/events/html-node/HtmlNodeEventEmitter.js';
import HtmlElementEvent from 'framework/system/interface/graphical/web/html/events/html-element/HtmlElementEvent.js';

// Class
class HtmlElementEventEmitter extends HtmlNodeEventEmitter {

	eventClass = HtmlElementEvent;

	static is(value) {
		return Class.isInstance(value, HtmlElementEventEmitter);
	}

}

// Export
export default HtmlElementEventEmitter;
