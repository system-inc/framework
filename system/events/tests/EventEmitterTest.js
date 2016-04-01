// Dependencies
var Test = Framework.require('system/test/Test.js');
var Assert = Framework.require('system/test/Assert.js');
var EventEmitter = Framework.require('system/events/EventEmitter.js');
var Event = Framework.require('system/events/Event.js');

// Class
var EventEmitterTest = Test.extend({

	// This should trigger a console warning
	//testRecommendedMaximumBoundFunctionsPerEventIdentifier: function() {
	//	var eventEmitter = new EventEmitter();
	//	var functionsToBind = 11;
	//	for(var i = 0; i < functionsToBind; i++) {
	//		eventEmitter.on('event1', function() {
	//		});
	//	}
	//},

	testEventEmitter: function*() {
		// Create the EventEmitter
		var eventEmitter = new EventEmitter();

		// List bound event listeners
		var eventListeners = eventEmitter.getEventListeners();
		//Console.info('eventListeners', eventListeners);
		Assert.strictEqual(eventListeners.length, 0, 'No event listeners are bound');

		// Variable used to store the event when it is emitted
		var capturedEvent = null;

		// Declare the function to bind
		var functionToBind = function(event) {
			capturedEvent = event;
		};

		// Bind the function to an event
		eventEmitter.on('event1', functionToBind);

		// List bound event listeners
		eventListeners = eventEmitter.getEventListeners();
		//Console.info('eventListeners', eventListeners);
		Assert.strictEqual(eventListeners.length, 1, 'One event listener is bound');

		// Emit an event
		yield eventEmitter.emit('event1', 'event1Data');
		Assert.true(Event.is(capturedEvent), 'Emitted an instance of Event');
		Assert.strictEqual(capturedEvent.identifier, 'event1', 'identifier is set correctly');
		Assert.strictEqual(capturedEvent.data, 'event1Data', 'data is set correctly');

		// Unbind a specific function the event
		eventEmitter.unbind('event1', functionToBind);

		// List bound event listeners
		eventListeners = eventEmitter.getEventListeners();
		//Console.info('eventListeners', eventListeners);
		Assert.strictEqual(eventListeners.length, 0, 'No event listeners are bound after unbind by specific function');

		// Bind the event again
		eventEmitter.on('event1', functionToBind);

		// Unbind all event listeners from an event pattern
		eventEmitter.unbind('event1');

		// List bound event listeners
		eventListeners = eventEmitter.getEventListeners();
		//Console.info('eventListeners', eventListeners);
		Assert.strictEqual(eventListeners.length, 0, 'No event listeners are bound after unbind by event pattern');

		// Bind the event again
		eventEmitter.on('event1', functionToBind);

		// Unbind all bound event listeners
		eventEmitter.unbindAll();

		// List bound event listeners
		eventListeners = eventEmitter.getEventListeners();
		//Console.info('eventListeners', eventListeners);
		Assert.strictEqual(eventListeners.length, 0, 'No event listeners are bound after unbindAll');
	},

	// If an EventEmitter does not have at least one listener registered for the 'error' event, and an 'error' event is emitted, the error is thrown, a stack trace is printed, and the Node.js process exits
	//testEventEmitterThrowsErrorWithoutRegisteredListeners: function*() {
	//	var eventEmitter = new EventEmitter();

	//	yield Assert.throws(function*() {
	//		yield eventEmitter.emit('event1', new Error());
	//	}, 'Throw an error when an event is emitted with data being an instance of Error and there are no event listeners');
	//},

	testEventEmitterWithWildcardEventPatterns: function*() {
	},

	testEventEmitterWithRegularExpressionEventPatterns: function*() {
	},

	/*
TODO:
	
	All EventEmitters emit the event 'newListener' when new listeners are added and 'removeListener' when a listener is removed.
	
	test .once

	Fire an event N times and then remove it, an extension of the once concept.
    server.on('foo', function() {
      console.log('hello');
    }, 4);

	server.on('get', function(value) {
      console.log('someone connected!');
    });
    console.log(server.listeners('get')); // [ [Function] ]

	Getting the actual event that fired.
    server.on('foo.*', function(event) {
      console.log(event);
    });

    server.off (alias for removeListener)

	Namespaces with Wildcards To use namespaces/wildcards, pass the wildcard option into the EventEmitter constructor. When namespaces/wildcards are enabled, events can either be strings (foo.bar) separated by a delimiter or arrays (['foo', 'bar']). The delimiter is also configurable as a constructor option.

	An event name passed to any event emitter method can contain a wild card (the * character). If the event name is a string, a wildcard may appear as foo.*. If the event name is an array, the wildcard may appear as ['foo', '*'].

        server.many(['foo', 'bar', 'bazz'], function() {
      console.log('hello');
    });

    be able to supply a regex
    emitter.on(/myevent/g)

	*/

});

// Export
module.exports = EventEmitterTest;