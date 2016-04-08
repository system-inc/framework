// Dependencies
var Event = Framework.require('system/events/Event.js');

// Class
var PropagatingEvent = Event.extend({

	propagationStopped: null, // Whether or not event.stopPropagation() has been called
		
	currentPhase: null, // PropagatingEvent.phases.capturing, PropagatingEvent.phases.atEmitter, or PropagatingEvent.phases.bubbling
	
	// The phases the event is registered for
	registeredPhases: [
		// By default we do not register for the capture phase, just atEmitter and bubbling
		'atEmitter',
		'bubbling',
	],

	// Prevents further propagation of the current event in the capturing and bubbling phases
	stopPropagation: function() {
		this.propagationStopped = true;
	},

});

// Static methods

PropagatingEvent.is = function(value) {
	return Class.isInstance(value, PropagatingEvent);
};

// Static properties

PropagatingEvent.phases = {
	capturing: 'capturing', // The event is being propagated from top to bottom through the emitter's ancestor objects. This process starts at the top-most parent and down the children until the emitter's parent is reached. Event listeners registered for capture mode when addEventListener() was called are triggered during this phase.
	atEmitter: 'atEmitter', // The event has arrived at the event's emitter. Event listeners registered for this phase are called at this time.
	bubbling: 'bubbling', // The event is propagating back up through the emitter's ancestors in reverse order, starting with it's parent, and eventually reaching the top-most parent. This is known as bubbling, and occurs only if the bubbling phase is registered. Event listeners registered for this phase are triggered during this process.
};

// Export
module.exports = PropagatingEvent;