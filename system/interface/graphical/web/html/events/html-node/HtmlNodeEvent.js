// Dependencies
import HtmlEvent from 'framework/system/interface/graphical/web/html/events/html-event/HtmlEvent.js';

// Class
class HtmlNodeEvent extends HtmlEvent {

	static is(value) {
		return Class.isInstance(value, HtmlNodeEvent);
	}
	
}

// Export
export default HtmlNodeEvent;
