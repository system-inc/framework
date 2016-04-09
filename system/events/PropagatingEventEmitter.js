// Dependencies
var EventEmitter = Framework.require('system/events/EventEmitter.js');
var PropagatingEvent = Framework.require('system/events/PropagatingEvent.js');

// Class
var PropagatingEventEmitter = EventEmitter.extend({

	parent: null,

	emit: function*(eventIdentifier, data, eventOptions) {
		// Emit the event as normal
		var propagatingEvent = yield this.super.apply(this, arguments);

		// Set the currentPhase - if the currentEmitter is this, then we are in the atEmitter phase

		Console.error('this next line exposes the problem - we need to bring in the tests from EventEmitter into PropagatingEventEmitter to see if I am breaking some functionality with .currentEmitter');
		Console.log('this.name', this.name, 'propagatingEvent.currentEmitter.name', propagatingEvent.currentEmitter.name);

		if(propagatingEvent.currentEmitter === this) {
			propagatingEvent.currentPhase = PropagatingEvent.phases.atEmitter;
		}
		// If the currentEmitter is not this, then we are in the bubbling phase
		else if(propagatingEvent.currentEmitter !== this) {
			propagatingEvent.currentPhase = PropagatingEvent.phases.bubbling;
		}

		// If we want to propagate
		if(
			this.parent && // If a parent is set
			!propagatingEvent.stopped && // and the event is not stopped
			!propagatingEvent.propagationStopped && // and the event propagation is not stopped
			PropagatingEvent.is(propagatingEvent) // and the event is an instance of PropagatingEvent
		) {
			// Have the parent emit the event
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