// Dependencies
import HtmlNodeEventEmitter from './../html-node/HtmlNodeEventEmitter.js';
import HtmlElementEvent from './HtmlElementEvent.js';

// Class
class HtmlElementEventEmitter extends HtmlNodeEventEmitter {

	eventClass = HtmlElementEvent;

	static is(value) {
		return Class.isInstance(value, HtmlElementEventEmitter);
	}

}

// Export
export default HtmlElementEventEmitter;
