// Class
var Event = Class.extend({

	identifier: null,
	data: null, // An optional object of data passed to an event method when the current executing handler is bound
	time: null,

	construct: function(identifier, data) {
		this.identifier = identifier;
		this.data = data;
		this.time = new Time();
	},

});

// Static methods

Event.is = function(value) {
	return Class.isInstance(value, Event);
};

// Export
module.exports = Event;