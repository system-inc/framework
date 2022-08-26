// Dependencies
import { StandardInputPressEvent } from '@framework/system/stream/events/StandardInputPressEvent.js';

// Class
class StandardInputHoverEvent extends StandardInputPressEvent {

	direction = null;

	static is(value) {
		return Class.isInstance(value, StandardInputHoverEvent);
	}

}

// Export
export { StandardInputHoverEvent };
