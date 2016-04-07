// Dependencies
var EventEmitter = Framework.require('system/events/EventEmitter.js');
var PropagatingEvent = Framework.require('system/events/PropagatingEvent.js');

// Class
var PropagatingEventEmitter = EventEmitter.extend({

	

});

// Static methods

PropagatingEventEmitter.is = function(value) {
	return Class.isInstance(value, PropagatingEventEmitter);
};

// Export
module.exports = PropagatingEventEmitter;