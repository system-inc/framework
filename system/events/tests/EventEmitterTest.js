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

	testStandardEventEmitter: function*() {
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
		eventEmitter.removeEventListener('event1', functionToBind);

		// List bound event listeners
		eventListeners = eventEmitter.getEventListeners();
		//Console.info('eventListeners', eventListeners);
		Assert.strictEqual(eventListeners.length, 0, 'No event listeners are bound after removeEventListener by specific function');

		// Bind the event again
		eventEmitter.on('event1', functionToBind);

		// Unbind all event listeners from an event pattern
		eventEmitter.removeEventListener('event1');

		// List bound event listeners
		eventListeners = eventEmitter.getEventListeners();
		//Console.info('eventListeners', eventListeners);
		Assert.strictEqual(eventListeners.length, 0, 'No event listeners are bound after removeEventListener by event pattern');

		// Bind the event again
		eventEmitter.on('event1', functionToBind);

		// Unbind all bound event listeners
		eventEmitter.removeAllEventListeners();

		// List bound event listeners
		eventListeners = eventEmitter.getEventListeners();
		//Console.info('eventListeners', eventListeners);
		Assert.strictEqual(eventListeners.length, 0, 'No event listeners are bound after removeAllEventListeners');

		// Bind an event listener with once
		eventEmitter.once('event1', functionToBind);

		// Emit the event
		yield eventEmitter.emit('event1', 'event1Data');
		
		// List bound event listeners
		eventListeners = eventEmitter.getEventListeners();
		//Console.info('eventListeners', eventListeners);
		Assert.strictEqual(eventListeners.length, 0, 'No event listeners are bound after a listener bound with .once() is emitted once');

		// Bind an event listener which will only emit 3 times
		eventEmitter.on('event1', functionToBind, 3);

		// Emit the event
		yield eventEmitter.emit('event1', 'event1Data');
		
		// List bound event listeners
		eventListeners = eventEmitter.getEventListeners();
		//Console.info('eventListeners', eventListeners);
		Assert.strictEqual(eventListeners.length, 1, 'Event listeners are bound after a listener bound with .on(eventIdentifier, function, 3) has been emitted once');

		// Emit the event
		yield eventEmitter.emit('event1', 'event1Data');

		// List bound event listeners
		eventListeners = eventEmitter.getEventListeners();
		//Console.info('eventListeners', eventListeners);
		Assert.strictEqual(eventListeners.length, 1, 'Event listeners are bound after a listener bound with .on(eventIdentifier, function, 3) has been emitted twice');

		// Emit the event
		yield eventEmitter.emit('event1', 'event1Data');

		// List bound event listeners
		eventListeners = eventEmitter.getEventListeners();
		//Console.info('eventListeners', eventListeners);
		Assert.strictEqual(eventListeners.length, 0, 'No event listeners are bound after a listener bound with .on(eventIdentifier, function, 3) has been emitted three times');

		// All EventEmitters emit the event 'addedListener' when new listeners are added and 'removeListener' when a listener is removed

		// A place to store the result of eventEmitter.newListener
		var capturedAddedEventListenerEvent = null;
		var capturedRemovedEventListenerEvent = null;
		var capturedRemovedAllEventListenersEvent = null;

		eventEmitter.on('eventEmitter.addedEventListener', function(event) {
			//Console.highlight(event);
			capturedAddedEventListenerEvent = event;
		});

		eventEmitter.on('eventEmitter.removedEventListener', function(event) {
			//Console.highlight(event);
			capturedRemovedEventListenerEvent = event;
		});

		// Trigger eventEmitter.addedEventListener by adding another event listener
		yield eventEmitter.on('event1', function(event) {
		});
		//Console.info('capturedAddedEventListenerEvent', capturedAddedEventListenerEvent);
		Assert.strictEqual(capturedAddedEventListenerEvent.data.eventPattern, 'event1', 'Captured eventEmitter.addedEventListener event');

		// Trigger eventEmitter.removedEventListener by adding another event listener
		yield eventEmitter.removeEventListener('event1');
		//Console.info('capturedRemovedEventListenerEvent', capturedRemovedEventListenerEvent);
		Assert.strictEqual(capturedRemovedEventListenerEvent.data.eventPattern, 'event1', 'Captured eventEmitter.removedEventListener event');

		//Console.highlight(eventEmitter);
	},

	testEventEmitterWithWildcardEventPattern: function*() {
		// Create the EventEmitter
		var eventEmitter = new EventEmitter();

		// Variable used to store the event when it is emitted
		var capturedEvent = null;

		// Declare the function to bind
		var functionToBind = function(event) {
			capturedEvent = event;
		};

		// Bind the function to an event
		eventEmitter.on('event1.*', functionToBind);

		// List bound event listeners
		eventListeners = eventEmitter.getEventListeners();
		//Console.info('eventListeners', eventListeners);
		Assert.strictEqual(eventListeners.length, 1, 'One event listener is bound');

		// Emit a non-matching event
		yield eventEmitter.emit('event');
		Assert.strictEqual(capturedEvent, null, 'Non-matching event does not trigger event listener');

		// Emit a matching event
		yield eventEmitter.emit('event1', 'event1Data');
		Assert.true(Event.is(capturedEvent), 'Emitted an instance of Event');
		Assert.strictEqual(capturedEvent.identifier, 'event1', 'identifier is set correctly');
		Assert.strictEqual(capturedEvent.data, 'event1Data', 'data is set correctly');
	},

	testEventEmitterWithRegularExpressionEventPattern: function*() {
		// Create the EventEmitter
		var eventEmitter = new EventEmitter();

		// Variable used to store the event when it is emitted
		var capturedEvent = null;

		// Declare the function to bind
		var functionToBind = function(event) {
			capturedEvent = event;
		};

		// Bind the function to an event
		eventEmitter.on(/(event1|event2)/, functionToBind);

		// List bound event listeners
		eventListeners = eventEmitter.getEventListeners();
		//Console.info('eventListeners', eventListeners);
		Assert.strictEqual(eventListeners.length, 1, 'One event listener is bound');

		// Emit a non-matching event
		yield eventEmitter.emit('event');
		Assert.strictEqual(capturedEvent, null, 'Non-matching event does not trigger event listener');

		// Emit a matching event
		yield eventEmitter.emit('event1', 'event1Data');
		Assert.true(Event.is(capturedEvent), 'Emitted an instance of Event');
		Assert.strictEqual(capturedEvent.identifier, 'event1', 'identifier is set correctly');
		Assert.strictEqual(capturedEvent.data, 'event1Data', 'data is set correctly');
	},

	// If an EventEmitter does not have at least one listener registered for the 'error' event, and an 'error' event is emitted, the error is thrown, a stack trace is printed, and the Node.js process exits
	testEventEmitterThrowsErrorWithoutRegisteredListeners: function*() {
		var eventEmitter = new EventEmitter();

		Console.log('need to imlpement Assert.throws for generators');

		yield Assert.throws(function*() {
			yield eventEmitter.emit('event1', new Error());
		}, 'Throw an error when an event is emitted with data being an instance of Error and there are no event listeners');
	},

});

// Export
module.exports = EventEmitterTest;