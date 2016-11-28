// Dependencies
import EventEmitter from 'framework/system/event/EventEmitter.js';
import PropagatingEvent from 'framework/system/event/PropagatingEvent.js';

// Class
class PropagatingEventEmitter extends EventEmitter {

	eventClass = PropagatingEvent;
	parent = null;

	async emit(eventIdentifier, data, eventOptions) {
		//app.log('PropagatingEventEmitter emit', this.tag, eventIdentifier);

		var propagatingEvent = null;

		var shouldEmitAncestorEventEmittersInCapturePath = false;
		// We are at the target emitter (because eventOptions is set) and the "capturing" phase is registered
		if(eventOptions && eventOptions.registeredPhases && eventOptions.registeredPhases.capturing) {
			shouldEmitAncestorEventEmittersInCapturePath = true;
		}

		if(shouldEmitAncestorEventEmittersInCapturePath) {
			//app.log('shouldEmitAncestorEventEmittersInCapturePath', shouldEmitAncestorEventEmittersInCapturePath);

			// Create the event, we must be the target emitter, so we pass "this" into createEvent
			propagatingEvent = this.createEvent(this, eventIdentifier, data, eventOptions);

			// Build the capturing path
			var ancestorEventEmittersInCapturePath = [];
			var context = this;
			while(context.parent) {
				ancestorEventEmittersInCapturePath.prepend(context.parent);
				context = context.parent;
			}
			//app.warn('ancestorEventEmittersInCapturePath', ancestorEventEmittersInCapturePath);

			// Emit the event along the capturing path
			await ancestorEventEmittersInCapturePath.each(async function(ancestorEventEmitterIndex, ancestorEventEmitter) {
				//app.log('should emit on', ancestorEventEmitter.name);
				// Emit the event all the way down until
				propagatingEvent = await ancestorEventEmitter.emit(eventIdentifier, propagatingEvent);
			});

			// Set data to be the propagating event, so when we shouldEmit below we emit the event instead of the initial data
			data = propagatingEvent;
		}

		// If we are emitting an existing event (propagating)
		if(PropagatingEvent.is(data)) {
			// Set the propagatingEvent to the data
			//app.info('setting propagatingEvent to data');
			propagatingEvent = data;
		}

		// If we have a propagatingEvent
		if(propagatingEvent) {
			//app.error('we have a propagating event');

			// Update the currentPhase of the event
			// We are at the emitter
			if(propagatingEvent.emitter === this) {
				propagatingEvent.currentPhase = PropagatingEvent.phases.atEmitter;
			}
			// We are capturing and have not hit the emitter yet
			else if(propagatingEvent.currentPhase == PropagatingEvent.phases.capturing) {
				// Do nothing
			}
			// We are not at the emitter and we are not capturing, so we must be bubbling
			else {
				propagatingEvent.currentPhase = PropagatingEvent.phases.bubbling;
			}
		}

		// Determine if the event should be emitted
		var shouldEmit = true;
		// If we are propagating an event
		if(propagatingEvent) {
			// Make sure the propagated event is registered for the phase it is in
			if(propagatingEvent.currentPhase == PropagatingEvent.phases.capturing) {
				if(!propagatingEvent.registeredPhases[PropagatingEvent.phases.capturing]) {
					shouldEmit = false;
				}
			}
			else if(propagatingEvent.currentPhase == PropagatingEvent.phases.atEmitter) {
				if(!propagatingEvent.registeredPhases[PropagatingEvent.phases.atEmitter]) {
					shouldEmit = false;
				}
			}
			else if(propagatingEvent.currentPhase == PropagatingEvent.phases.bubbling) {
				if(!propagatingEvent.registeredPhases[PropagatingEvent.phases.bubbling]) {
					shouldEmit = false;
				}
			}
		}
		// Or if we are not propagating an existing event, we must be in the "atEmitter" phase, so make sure the passed eventOptions allow the "atEmitter" phase
		else if(eventOptions && eventOptions.registeredPhases && eventOptions.registeredPhases.atEmitter == false) {
			shouldEmit = false;
		}

		//app.warn('propagatingEvent.currentPhase', propagatingEvent.currentPhase);

		// Conditionally emit the event at the current level
		if(shouldEmit) {
			propagatingEvent = await super.emit(eventIdentifier, data, eventOptions); // this will make propagatingEvent.currentEmitter = this
		}

		//app.warn('propagatingEvent.currentPhase', propagatingEvent.currentPhase);

		// Determine if we should bubble
		var shouldBubble = true;
		// If we have a propagating event
		if(propagatingEvent) {
			// Don't bubble if the event is stopped
			if(propagatingEvent.stopped) {
				shouldBubble = false;
			}
			// Don't bubble if the event propagation is stopped
			else if(propagatingEvent.propagationStopped) {
				shouldBubble = false;
			}
			// Don't bubble if the event is not a PropagatingEvent
			else if(!PropagatingEvent.is(propagatingEvent)) {
				shouldBubble = false;
			}
			// Don't bubble if the event is not registered for the "bubbling" phase
			else if(propagatingEvent.registeredPhases[PropagatingEvent.phases.bubbling] == false) {
				shouldBubble = false;
			}
			// Don't bubble if the event is in the "capturing" phase
			else if(propagatingEvent.currentPhase == PropagatingEvent.phases.capturing) {
				//app.info('not bubbling because we are capturing')
				shouldBubble = false;
			}
		}

		// Conditionally bubble if we should bubble and we have a parent
		if(shouldBubble && this.parent) {
			// If we don't have an event to propagate we need to make one
			if(!propagatingEvent) {
				// We must be the target emitter, so we pass "this" into createEvent
				propagatingEvent = this.createEvent(this, eventIdentifier, data, eventOptions);
			}

			propagatingEvent = await this.parent.emit(eventIdentifier, propagatingEvent);
		}

		return propagatingEvent;
	}

	static is(value) {
		return Class.isInstance(value, PropagatingEventEmitter);
	}

}

// Export
export default PropagatingEventEmitter;
