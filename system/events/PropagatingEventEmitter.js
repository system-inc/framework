// Dependencies
var EventEmitter = Framework.require('system/events/EventEmitter.js');
var PropagatingEvent = Framework.require('system/events/PropagatingEvent.js');

// Class
var PropagatingEventEmitter = EventEmitter.extend({

	parent: null,

	emit: function*(eventIdentifier, data, eventOptions, propagate) {
		// propagate defaults to true
		if(propagate === undefined) {
			propagate = true;
		}

		// Emit the event as normal
		var propagatingEvent = yield this.super.apply(this, arguments);

		// If we want to propagate
		if(
			this.parent && // If a parent is set
			!propagatingEvent.stopped && // and the event is not stopped
			!propagatingEvent.propagationStopped && // and the event propagation is not stopped
			PropagatingEvent.is(propagatingEvent) // and the event is an instance of PropagatingEvent
		) {
			// Have the parent emit the event
			yield this.parent.emit(eventIdentifier, data, eventOptions);
		}
	},

	createEvent: function(eventIdentifier, data, eventOptions) {
		var event = new PropagatingEvent(eventIdentifier, data, eventOptions);

		return event;
	},

});

// Static methods

PropagatingEventEmitter.is = function(value) {
	return Class.isInstance(value, PropagatingEventEmitter);
};

// Export
module.exports = PropagatingEventEmitter;