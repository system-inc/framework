// Dependencies
var Event = Framework.require('system/events/Event.js');
var EventListener = Framework.require('system/events/EventListener.js');

// Class
var EventEmitter = Class.extend({

	eventListeners: {}, // eventIdentifer: EventListener

	maximumListeners: null,

	construct: function() {
		this.maximumListeners = EventEmitter.defaultMaximumListeners;
	},

	emit: function*(eventIdentifier, data) {
		//Console.log('EventEmitter.emit', 'eventIdentifier', eventIdentifier, 'data', data);

		if(this.eventListeners[eventIdentifier] !== undefined) {
			yield this.eventListeners[eventIdentifier].runCallbacks(data);
		}
	},

	on: function(eventIdentifier, callback, options) {
		return this.addListener(eventIdentifier, callback, options);
	},

	once: function(eventIdentifier, callback, options) {
		return this.addListener(eventIdentifier, callback, options);
	},

	addListener: function(eventIdentifier, callback, options) {
		//Console.log('EventEmitter.addListener', 'eventIdentifier', eventIdentifier, 'callback', callback, 'options', options);

		// List the event identifier in the list of events
		if(this.eventListeners[eventIdentifier] === undefined) {
			this.eventListeners[eventIdentifier] = new EventListener(this, eventIdentifier);
		}

		this.eventListeners[eventIdentifier].addCallback(callback, options);
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