// Dependencies
var Event = Framework.require('system/events/Event.js');

// Class
var PropagatingEvent = Event.extend({



});

// Static methods

PropagatingEvent.is = function(value) {
	return Class.isInstance(value, PropagatingEvent);
};

// Export
module.exports = PropagatingEvent;