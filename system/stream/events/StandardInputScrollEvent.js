// Dependencies
import { StandardInputPressEvent } from '@framework/system/stream/events/StandardInputPressEvent.js';

// Class
class StandardInputScrollEvent extends StandardInputPressEvent {

	direction = null;

	static is(value) {
		return Class.isInstance(value, StandardInputScrollEvent);
	}

}

// Export
export { StandardInputScrollEvent };
