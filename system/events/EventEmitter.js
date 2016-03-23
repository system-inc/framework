// Class
var EventEmitter = Class.extend({

	/* {
			eventIdentifier: {
				listeners: [], array of functions to evoke
			},
		}
	*/
	events: {},

	maximumListeners: EventEmitter.defaultMaximumListeners,

	construct: function() {

	},

	on: function(eventIdentifier, callback) {
		if(this.events[eventIdentifier]) {
			this.events[eventIdentifier].listeners = 
		}
	},

	emit: function() {

	},

	once: function() {

	},

	setMaximumListeners: function(maximumListeners) {

	},

});

// Static properties

EventEmitter.defaultMaximumListeners = 10;

// Export
module.exports = EventEmitter;