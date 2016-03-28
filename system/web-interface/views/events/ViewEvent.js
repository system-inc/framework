// Class
var ViewEvent = Event.extend({

	identifier: null,
	data: null, // An optional object of data passed to an event method when the current executing handler is bound

});

// Export
module.exports = Event;