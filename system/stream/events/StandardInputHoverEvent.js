// Dependencies
import { StandardInputPressEvent } from '@framework/system/stream/events/StandardInputPressEvent.js';

// Class
class StandardInputHoverEvent extends StandardInputPressEvent {

	static is(value) {
		return Class.isInstance(value, StandardInputHoverEvent);
	}

}

// Export
export { StandardInputHoverEvent };
