// Dependencies
import Event from 'framework/system/event/Event.js';

// Class
class PropagatingEvent extends Event {

	propagationStopped = null; // Whether or not event.stopPropagation() has been called
	currentPhase = null; // PropagatingEvent.phases.capturing, PropagatingEvent.phases.atEmitter, or PropagatingEvent.phases.bubbling
	registeredPhases = {}; // The phases the event is registered for

	constructor(emitter, identifier, data, options) {
		super(...arguments);

		options = {
			propagationStopped: false,
			registeredPhases: { // By default we do not register for the capture phase, just atEmitter and bubbling
				atEmitter: true,
				bubbling: true,
			},
		}.merge(options);

		//app.info('options', options);

		// Set propagationStopped option
		if(options.propagationStopped) {
			this.propagationStopped = true;
		}

		// Set initial currentPhase
		if(options.registeredPhases[PropagatingEvent.phases.capturing]) {
			this.currentPhase = PropagatingEvent.phases.capturing;
		}
		else if(options.registeredPhases[PropagatingEvent.phases.atEmitter]) {
			this.currentPhase = PropagatingEvent.phases.atEmitter;
		}
		else if(options.registeredPhases[PropagatingEvent.phases.bubbling]) {
			this.currentPhase = PropagatingEvent.phases.bubbling;
		}		

		// Capturing phase
		if(options.registeredPhases[PropagatingEvent.phases.capturing]) {
			this.registeredPhases[PropagatingEvent.phases.capturing] = true;
		}
		else {
			this.registeredPhases[PropagatingEvent.phases.capturing] = false;
		}

		// At emitter phase
		if(options.registeredPhases[PropagatingEvent.phases.atEmitter]) {
			this.registeredPhases[PropagatingEvent.phases.atEmitter] = true;
		}
		else {
			this.registeredPhases[PropagatingEvent.phases.atEmitter] = false;
		}

		// Bubbling phase
		if(options.registeredPhases[PropagatingEvent.phases.bubbling]) {
			this.registeredPhases[PropagatingEvent.phases.bubbling] = true;
		}
		else {
			this.registeredPhases[PropagatingEvent.phases.bubbling] = false;
		}
	}

	// Prevents further propagation of the current event in the capturing and bubbling phases
	stopPropagation() {
		this.propagationStopped = true;
	}

	static phases = {
		capturing: 'capturing', // The event is being propagated from top to bottom through the emitter's ancestor objects. This process starts at the top-most parent and down the children until the emitter's parent is reached. Event listeners registered for capture mode when addEventListener() was called are triggered during this phase.
		atEmitter: 'atEmitter', // The event has arrived at the event's emitter. Event listeners registered for this phase are called at this time.
		bubbling: 'bubbling', // The event is propagating back up through the emitter's ancestors in reverse order, starting with it's parent, and eventually reaching the top-most parent. This is known as bubbling, and occurs only if the bubbling phase is registered. Event listeners registered for this phase are triggered during this process.
	};

	static is(value) {
		return Class.isInstance(value, PropagatingEvent);
	}

}

// Export
export default PropagatingEvent;
