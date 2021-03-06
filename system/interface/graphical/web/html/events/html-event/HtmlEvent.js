// Dependencies
import { PropagatingEvent } from '@framework/system/event/PropagatingEvent.js';

// Class
class HtmlEvent extends PropagatingEvent {

	domEvent = null; // The native event emitted by the DOM
	trusted = null; // Set to true if the event was generated by a user action, and false when the event was created or modified by a script or dispatched via dispatchEvent

	stop() {
		//console.info('HtmlEvent.stop()', this);

		if(this.domEvent) {
			//app.log('this.domEvent is set and', this.domEvent.stopImmediatePropagation);
			this.domEvent.stopImmediatePropagation();
		}

		return super.stop(...arguments);
	}

	stopPropagation() {
		if(this.domEvent) {
			this.domEvent.stopPropagation();
		}

		return super.stopPropagation(...arguments);
	}

	preventDefault() {
		if(this.domEvent) {
			this.domEvent.preventDefault();
		}

		return super.preventDefault(...arguments);
	}

	static is(value) {
		return Class.isInstance(value, HtmlEvent);
	}

}

// Export
export { HtmlEvent };
