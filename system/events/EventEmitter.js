// Dependencies
var Event = Framework.require('system/events/Event.js');

// Class
var EventEmitter = Class.extend({

	/* {
			eventIdentifier: {
				listeners: [], array of functions to evoke
			},
		}
	*/
	events: {},

	maximumListeners: null,

	construct: function() {
		this.maximumListeners = EventEmitter.defaultMaximumListeners;
	},

	emit: function(eventIdentifier, data) {
		// Loop through all of the listeners for the eventIdentifier and trigger their callback
	},

	on: function(eventIdentifier, callback, options) {
		return this.addListener.apply(this, arguments);
	},

	once: function(eventIdentifier, callback, options) {
		return this.addListener(eventIdentifier, callback, options);
	},

	addListener: function(eventIdentifier, callback, options) {
		//if(this.events[eventIdentifier]) {
		//	this.events[eventIdentifier].listeners = 
		//}
	},

	removeListener: function() {

	},

	removeAllListeners: function() {

	},

	setMaximumListeners: function(maximumListeners) {
		this.maximumListeners = maximumListeners;

		return this.maximumListeners;
	},

});

// Static properties

EventEmitter.defaultMaximumListeners = 10;

// Export
module.exports = EventEmitter;