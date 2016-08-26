// Dependencies
import HtmlEventEmitter from './../html-event/HtmlEventEmitter.js';
import HtmlNodeEvent from './HtmlNodeEvent.js';

// Class
class HtmlNodeEventEmitter extends HtmlEventEmitter {

	eventClass = HtmlNodeEvent;

	static is(value) {
		return Class.isInstance(value, HtmlNodeEventEmitter);
	}

}

// Export
export default HtmlNodeEventEmitter;
