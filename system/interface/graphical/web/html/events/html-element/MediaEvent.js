// Dependencies
import { HtmlElementEvent } from '@framework/system/interface/graphical/web/html/events/html-element/html-element/HtmlElementEvent.js';

// Class
class MediaEvent extends HtmlElementEvent{

	static is(value) {
		return Class.isInstance(value, MediaEvent);
	}

}

// Export
export { MediaEvent };
