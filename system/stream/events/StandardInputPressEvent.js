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

	clone() {
		var clone = new StandardInputPressEvent();
		this.cloneProperties(clone);
		return clone;
	}

	cloneProperties(clone) {
		// StandardInputPressEvent properties
		clone.button = this.button;
		clone.buttonsDown = this.buttonsDown;
		clone.position = this.position;

		// StandardInputEvent properties
		clone.modifierKeysDown = this.modifierKeysDown;

		// Event properties
		clone.emitter = this.emitter;
		clone.currentEmitter = this.currentEmitter;
		clone.identifier = this.identifier;
		clone.data = this.data;
		clone.stopped = this.stopped;
		clone.defaultCanBePrevented = this.defaultCanBePrevented;
		clone.defaultPrevented = this.defaultPrevented;
		clone.previousReturnValue = this.previousReturnValue;
		clone.time = this.time;
	}

	static is(value) {
		return Class.isInstance(value, StandardInputPressEvent);
	}

	static pressCountMap = {
		2: 'double',
		3: 'triple',
		4: 'quadruple',
	};

	static buttonMap = {
		2: 'secondary', // right-click and two-finger tap
		3: 'tertiary', // middle-click and three-finger tap
		4: 'quarternary', // mouse button 4 and four-finger tap
		5: 'quinary', // mouse button 5 and five-finger tap
	};

}

// Export
export { StandardInputPressEvent };
