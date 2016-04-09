// Dependencies
var EventEmitter = Framework.require('system/events/EventEmitter.js');
var PropagatingEvent = Framework.require('system/events/PropagatingEvent.js');

// Class
var PropagatingEventEmitter = EventEmitter.extend({

	parent: null,

	emit: function*(eventIdentifier, data, eventOptions) {
		var propagatingEvent = null;

		// If we are emitting an existing event (propagating)
		if(PropagatingEvent.is(data)) {
			propagatingEvent = data;

			// Update the currentPhase of the event
			// We are at the emitter
			if(propagatingEvent.emitter === this) {
				propagatingEvent.currentPhase = PropagatingEvent.phases.atEmitter;
			}
			// We are capturing and have not hit the emitter yet
			else if(propagatingEvent.currentPhase == PropagatingEvent.phases.capturing) {
				propagatingEvent.currentPhase = PropagatingEvent.phases.capturing;
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

		// Conditionally emit the event at the current level
		if(shouldEmit) {
			propagatingEvent = yield this.super(eventIdentifier, data, eventOptions); // this will make propagatingEvent.currentEmitter = this
		}

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
		}

		// Conditionally bubble if we should bubble and we have a parent
		if(shouldBubble && this.parent) {
			// If we don't have an event to propagate we need to make one
			if(!propagatingEvent) {
				// We must be the target emitter, so we pass "this" into createEvent
				propagatingEvent = this.createEvent(this, eventIdentifier, data, eventOptions);
			}

			propagatingEvent = yield this.parent.emit(eventIdentifier, propagatingEvent);
		}

		return propagatingEvent;
	},

	createEvent: function(emitter, eventIdentifier, data, eventOptions) {
		var event = new PropagatingEvent(emitter, eventIdentifier, data, eventOptions);

		return event;
	},

});

// Static methods

PropagatingEventEmitter.is = function(value) {
	return Class.isInstance(value, PropagatingEventEmitter);
};

// Export
module.exports = PropagatingEventEmitter;