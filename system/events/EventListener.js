// Dependencies
var EventEmitter = Framework.require('system/events/EventEmitter.js');
var Event = Framework.require('system/events/Event.js');

// Class
var EventListener = Class.extend({

	eventEmitter: null,
	eventIdentifier: null,
	maximumListeners: 10,
	callbacks: [],

	construct: function(eventEmitter, eventIdentifier, maximumListeners) {
		this.eventEmitter = eventEmitter;
		this.eventIdentifier = eventIdentifier;
		this.maximumListeners = maximumListeners;
	},

	addCallback: function(callback, options) {
		this.callbacks.append(callback);
	},

	runCallbacks: function*(data) {
		//Console.log('EventListener.runCallbacks', 'data', data);

		var event = new Event(this.eventIdentifier, data);
		//Console.log('event', event);

		// Loop through all callbacks synchronously
		yield this.callbacks.each(function*(callbackIndex, callback) {
			//Console.log('callbackIndex', callbackIndex);
			var result = yield callback(event);
			//Console.log('callback result', result);
		});

		//Console.log('EventListener end loop');
	},

});

// Export
module.exports = EventListener;