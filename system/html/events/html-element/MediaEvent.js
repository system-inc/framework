// Dependencies
import HtmlElementEvent from './../html-element/HtmlElementEvent.js';

// Class
class MediaEvent extends HtmlElementEvent{

	static is(value) {
		return Class.isInstance(value, MediaEvent);
	}

}

// Export
export default MediaEvent;
