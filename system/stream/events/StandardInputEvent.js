// Dependencies
import { Event } from '@framework/system/event/Event.js';

// Class
class StandardInputEvent extends Event {

    // Keys down when the event was emitted
	modifierKeysDown = {
		alt: null, // true if the alt key was down
		control: null, // true if the control key was down
		shift: null, // true if the shift key was down
	};

	static is(value) {
		return Class.isInstance(value, StandardInputEvent);
	}

}

// Export
export { StandardInputEvent };
