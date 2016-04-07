// Class
var PropagatingEvent = Class.extend({

});

// Static methods

PropagatingEvent.is = function(value) {
	return Class.isInstance(value, PropagatingEvent);
};

// Export
module.exports = PropagatingEvent;