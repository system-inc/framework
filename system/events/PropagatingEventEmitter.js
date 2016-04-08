// Dependencies
var EventEmitter = Framework.require('system/events/EventEmitter.js');
var PropagatingEvent = Framework.require('system/events/PropagatingEvent.js');

// Class
var PropagatingEventEmitter = EventEmitter.extend({

	parent: null,

	/*
		A propagating event emitter is one where after an event has been emitted, it checks for .parent, and if a parent is set, it calls this.parent.emit and passes the same event
		until this.parent is null or until the event propagation is stopped
	*/
	
	emit: function*(eventIdentifier, data, propagate) {
		// propagate defaults to true
		if(propagate === undefined) {
			propagate = true;
		}

		// Emit the event as normal
		var propagatingEvent = yield this.super.apply(this, arguments);

		// If we want to propagate, and the event to propagate is a PropagatingEvent, and a parent is set
		if(propagate && PropagatingEvent.is(propagatingEvent) && this.parent) {
			// Have the parent emit the event as well
			yield this.parent.emit(eventIdentifier, data);
		}
	},

	createEvent: function(eventIdentifier, data) {
		var event = new PropagatingEvent(eventIdentifier, data);

		return event;
	},

});

// Static methods

PropagatingEventEmitter.is = function(value) {
	return Class.isInstance(value, PropagatingEventEmitter);
};

// Export
module.exports = PropagatingEventEmitter;