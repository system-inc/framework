// Dependencies
import { HtmlEventEmitter } from '@framework/system/interface/graphical/web/html/events/html-event/HtmlEventEmitter.js';
import { HtmlNodeEvent } from '@framework/system/interface/graphical/web/html/events/html-node/HtmlNodeEvent.js';

// Class
class HtmlNodeEventEmitter extends HtmlEventEmitter {

	eventClass = HtmlNodeEvent;

	static is(value) {
		return Class.isInstance(value, HtmlNodeEventEmitter);
	}

}

// Export
export { HtmlNodeEventEmitter };
