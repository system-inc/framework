// Dependencies
import { StandardInputEvent } from '@framework/system/stream/events/StandardInputEvent.js';

// Class
class StandardInputKeyEvent extends StandardInputEvent {

	// The key
	key = null;

	static is(value) {
		return Class.isInstance(value, StandardInputKeyEvent);
	}

}

// Export
export { StandardInputKeyEvent };
