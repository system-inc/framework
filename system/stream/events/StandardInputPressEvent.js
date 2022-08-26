// Dependencies
import { StandardInputEvent } from '@framework/system/stream/events/StandardInputEvent.js';

// Class
class StandardInputPressEvent extends StandardInputEvent {

    // The button number that was pressed when the mouse event was emitted
	// 1: Main button pressed, usually the left button or the un-initialized state
	// 2: Secondary button pressed, usually the right button
	// 3: Auxiliary button pressed, usually the wheel button or the middle button (if present)
	// 4: Fourth button, typically the Browser Back button
	// 5: Fifth button, typically the Browser Forward button
	button = null;

	// InputPress buttons down when the mouse event was emitted
	buttonsDown = {
		1: null,
		2: null,
		3: null,
		4: null,
		5: null,
	};

    // The position of the cursor, starting at 1,1 (row, column) and moving from top left to bottom right
    position = {
        x: null,
        y: null,
    };

	static is(value) {
		return Class.isInstance(value, StandardInputPressEvent);
	}

}

// Export
export { StandardInputPressEvent };
