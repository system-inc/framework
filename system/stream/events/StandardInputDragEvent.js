// Dependencies
import { StandardInputHoverEvent } from '@framework/system/stream/events/StandardInputHoverEvent.js';

// Class
class StandardInputDragEvent extends StandardInputHoverEvent {

    clone() {
		var clone = new StandardInputDragEvent();
		this.cloneProperties(clone);
		return clone;
	}

	static is(value) {
		return Class.isInstance(value, StandardInputDragEvent);
	}

}

// Export
export { StandardInputDragEvent };
