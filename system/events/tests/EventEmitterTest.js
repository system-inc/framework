// Dependencies
import Test from 'system/test/Test.js';
import Assert from 'system/test/Assert.js';
import EventEmitter from 'system/events/EventEmitter.js';
import Event from 'system/events/Event.js';

// Class
class EventEmitterTest extends Test {

	// This should trigger a console warning
	//async testRecommendedMaximumBoundFunctionsPerEventIdentifier() {
	//	var eventEmitter = new EventEmitter();
	//	var functionsToBind = 11;
	//	for(var i = 0; i < functionsToBind; i++) {
	//		await eventEmitter.on('event1', function() {
	//		});
	//	}
	//},

	async testCoreEventEmitterFunctionality() {
		// Create the EventEmitter
		var eventEmitter = new EventEmitter();

		// List bound event listeners
		var eventListeners = eventEmitter.getEventListeners();
		//app.info('eventListeners', eventListeners);
		Assert.strictEqual(eventListeners.length, 0, 'No event listeners are bound');

		// Variable used to store the event when it is emitted
		var storedEvent = null;

		// Declare the function to bind
		var functionToBind = function(event) {
			storedEvent = event;
			return 'previousReturnValue';
		};

		// Bind the function to an event
		eventEmitter.on('event1', functionToBind);

		// List bound event listeners
		eventListeners = eventEmitter.getEventListeners();
		//app.info('eventListeners', eventListeners);
		Assert.strictEqual(eventListeners.length, 1, 'One event listener is bound');

		// Emit an event
		await eventEmitter.emit('event1', 'event1Data');
		Assert.true(Event.is(storedEvent), 'Emitted an instance of Event');
		Assert.strictEqual(storedEvent.identifier, 'event1', 'identifier is set correctly');
		Assert.strictEqual(storedEvent.data, 'event1Data', 'data is set correctly');
		Assert.strictEqual(storedEvent.emitter, eventEmitter, 'emitter is set correctly');
		Assert.strictEqual(storedEvent.currentEmitter, eventEmitter, 'currentEmitter is set correctly');
		Assert.strictEqual(storedEvent.previousReturnValue, 'previousReturnValue', 'previousReturnValue is set correctly');

		// Unbind a specific function the event
		eventEmitter.removeEventListener('event1', functionToBind);

		// List bound event listeners
		eventListeners = eventEmitter.getEventListeners();
		//app.info('eventListeners', eventListeners);
		Assert.strictEqual(eventListeners.length, 0, 'No event listeners are bound after removeEventListener by specific function');

		// Bind the event again
		eventEmitter.on('event1', functionToBind);

		// Unbind all event listeners from an event pattern
		eventEmitter.removeEventListener('event1');

		// List bound event listeners
		eventListeners = eventEmitter.getEventListeners();
		//app.info('eventListeners', eventListeners);
		Assert.strictEqual(eventListeners.length, 0, 'No event listeners are bound after removeEventListener by event pattern');

		// Bind the event again
		eventEmitter.on('event1', functionToBind);

		// Unbind all bound event listeners
		eventEmitter.removeAllEventListeners();

		// List bound event listeners
		eventListeners = eventEmitter.getEventListeners();
		//app.info('eventListeners', eventListeners);
		Assert.strictEqual(eventListeners.length, 0, 'No event listeners are bound after removeAllEventListeners');

		// Bind an event listener with once
		eventEmitter.once('event1', functionToBind);

		// Emit the event
		await eventEmitter.emit('event1', 'event1Data');
		
		// List bound event listeners
		eventListeners = eventEmitter.getEventListeners();
		//app.info('eventListeners', eventListeners);
		Assert.strictEqual(eventListeners.length, 0, 'No event listeners are bound after a listener bound with .once() is emitted once');

		// Bind an event listener which will only emit 3 times
		eventEmitter.on('event1', functionToBind, 3);

		// Emit the event
		await eventEmitter.emit('event1', 'event1Data');
		
		// List bound event listeners
		eventListeners = eventEmitter.getEventListeners();
		//app.info('eventListeners', eventListeners);
		Assert.strictEqual(eventListeners.length, 1, 'Event listeners are bound after a listener bound with .on(eventIdentifier, function, 3) has been emitted once');

		// Emit the event
		await eventEmitter.emit('event1', 'event1Data');

		// List bound event listeners
		eventListeners = eventEmitter.getEventListeners();
		//app.info('eventListeners', eventListeners);
		Assert.strictEqual(eventListeners.length, 1, 'Event listeners are bound after a listener bound with .on(eventIdentifier, function, 3) has been emitted twice');

		// Emit the event
		await eventEmitter.emit('event1', 'event1Data');

		// List bound event listeners
		eventListeners = eventEmitter.getEventListeners();
		//app.info('eventListeners', eventListeners);
		Assert.strictEqual(eventListeners.length, 0, 'No event listeners are bound after a listener bound with .on(eventIdentifier, function, 3) has been emitted three times');

		// All EventEmitters emit the event 'addedListener' when new listeners are added and 'removeListener' when a listener is removed

		// A place to store the result of eventEmitter.newListener
		var storedAddedEventListenerEvent = null;
		var storedRemovedEventListenerEvent = null;
		var storedRemovedAllEventListenersEvent = null;

		eventEmitter.on('eventEmitter.addedEventListener', function(event) {
			//app.highlight(event);
			storedAddedEventListenerEvent = event;
		});

		eventEmitter.on('eventEmitter.removedEventListener', function(event) {
			//app.highlight(event);
			storedRemovedEventListenerEvent = event;
		});

		// Trigger eventEmitter.addedEventListener by adding another event listener
		await eventEmitter.on('event1', function(event) {
		});
		//app.info('storedAddedEventListenerEvent', storedAddedEventListenerEvent);
		Assert.strictEqual(storedAddedEventListenerEvent.data.eventPattern, 'event1', 'stored eventEmitter.addedEventListener event');

		// Trigger eventEmitter.removedEventListener by adding another event listener
		await eventEmitter.removeEventListener('event1');
		//app.info('storedRemovedEventListenerEvent', storedRemovedEventListenerEvent);
		Assert.strictEqual(storedRemovedEventListenerEvent.data.eventPattern, 'event1', 'stored eventEmitter.removedEventListener event');

		//app.highlight(eventEmitter);
	}

	async testEventPassing() {
		// Create the EventEmitter
		var eventEmitter1 = new EventEmitter();
		var eventEmitter2 = new EventEmitter();

		// Variable used to store the event when it is emitted
		var storedEventForEventEmitter1 = null;
		var storedEventForEventEmitter2 = null;

		// Listen for events to store
		eventEmitter1.on('event1', function(event) {
			storedEventForEventEmitter1 = event;
		});
		eventEmitter2.on('event1', function(event) {
			storedEventForEventEmitter2 = event;
		});

		// Emit an event
		var emittedEventForEventEmitter1 = await eventEmitter1.emit('event1', 'event1Data');
		Assert.strictEqual(storedEventForEventEmitter1, emittedEventForEventEmitter1, '.emit() returns the emitted event');
		Assert.strictEqual(storedEventForEventEmitter1.emitter, eventEmitter1, 'emitter is set correctly');
		Assert.strictEqual(storedEventForEventEmitter1.currentEmitter, eventEmitter1, 'currentEmitter is set correctly');

		// Emit the stored event (pass the event along)
		var emittedEventForEventEmitter2 = await eventEmitter2.emit('event1', emittedEventForEventEmitter1);
		Assert.strictEqual(storedEventForEventEmitter2.emitter, eventEmitter1, 'emitter is set correctly');
		Assert.strictEqual(storedEventForEventEmitter2.currentEmitter, eventEmitter2, 'currentEmitter is set correctly');		
	}

	async testPreventDefault() {
		// Create the EventEmitter
		var eventEmitter = new EventEmitter();

		// Variable used to store the event when it is emitted
		var storeForEventListener1 = null;
		var storeForEventListener2 = null;

		// The first event listener calls event.preventDefault();
		eventEmitter.on('event1', function(event) {
			event.preventDefault();
			storeForEventListener1 = event;
		});

		// The second event listener checks to see if event.defaultPrevented is truthy, and if it is it will change its behavior
		eventEmitter.on('event1', function(event) {
			if(event.defaultPrevented) {
				storeForEventListener2 = 'defaultPrevented';
			}
			else {
				storeForEventListener2 = 'defaultNotPrevented';
			}
		});

		// Emit an event
		var event = await eventEmitter.emit('event1', 'event1Data');

		Assert.strictEqual(storeForEventListener2, 'defaultPrevented', '.preventDefault() affects the next event listener');
	}

	async testDefaultEventCanBePrevented() {
		// Create the EventEmitter
		var eventEmitter = new EventEmitter();

		// Variable used to store the event when it is emitted
		var storeForEventListener1 = null;
		var storeForEventListener2 = null;

		// The first event listener calls event.preventDefault();
		eventEmitter.on('event1', function(event) {
			event.preventDefault();
			storeForEventListener1 = event;
		});

		// The second event listener checks to see if event.defaultPrevented is truthy, and if it is it will change its behavior
		eventEmitter.on('event1', function(event) {
			if(event.defaultPrevented) {
				storeForEventListener2 = 'defaultPrevented';
			}
			else {
				storeForEventListener2 = 'defaultNotPrevented';
			}
		});

		// Emit an event where defaultPrevented does not work
		var event = await eventEmitter.emit('event1', 'event1Data', {
			defaultCanBePrevented: false,
		});

		Assert.strictEqual(storeForEventListener2, 'defaultNotPrevented', 'Events constructed with the event option "defaultCanBePrevented" set to false make calls to .preventDefault() do nothing');
	}

	async testStop() {
		// Create the EventEmitter
		var eventEmitter = new EventEmitter();

		// Variable used to store the event when it is emitted
		var storeForEventListener1 = null;
		var storeForEventListener2 = null;

		// The first event listener calls event.stop();
		eventEmitter.on('event1', function(event) {
			event.stop();
			storeForEventListener1 = event;
		});

		// Second event listener should never be activated
		eventEmitter.on('event1', function(event) {
			storeForEventListener2 = event;
		});

		// Emit an event
		var event = await eventEmitter.emit('event1', 'event1Data');
		
		Assert.strictEqual(storeForEventListener1.data, 'event1Data', 'Calling .stop() does not stop further code in the function from being executed');
		
		//app.log('storeForEventListener2', storeForEventListener2);
		Assert.strictEqual(storeForEventListener2, null, '.stop() prevents other listeners of the same event from being called');
	}

	async testAddingMultipleEventListeners() {
		// Create the EventEmitter
		var eventEmitter = new EventEmitter();

		// Variable used to store the event when it is emitted
		var storedEvent = null;

		// Add events using an array
		eventEmitter.on(['event1', 'event2', 'event3'], function(event) {
			storedEvent = event;
		});

		// List bound event listeners
		var eventListeners = eventEmitter.getEventListeners();
		//app.info('eventListeners', eventListeners);
		Assert.strictEqual(eventListeners.length, 3, 'The correct number of event listeners are bound');

		// Emit event 1
		await eventEmitter.emit('event1');
		Assert.strictEqual(storedEvent.identifier, 'event1', 'identifier is set correctly');

		// Emit event 2
		await eventEmitter.emit('event2');
		Assert.strictEqual(storedEvent.identifier, 'event2', 'identifier is set correctly');

		// Emit event 3
		await eventEmitter.emit('event3');
		Assert.strictEqual(storedEvent.identifier, 'event3', 'identifier is set correctly');

		// Add events using a string
		eventEmitter.on('event4, event5,event6 event7', function(event) {
			storedEvent = event;
		});

		// List bound event listeners
		var eventListeners = eventEmitter.getEventListeners();
		//app.info('eventListeners', eventListeners);
		Assert.strictEqual(eventListeners.length, 7, 'The correct number of event listeners are bound');

		// Emit event 4
		await eventEmitter.emit('event4');
		Assert.strictEqual(storedEvent.identifier, 'event4', 'identifier is set correctly');

		// Emit event 5
		await eventEmitter.emit('event5');
		Assert.strictEqual(storedEvent.identifier, 'event5', 'identifier is set correctly');

		// Emit event 6
		await eventEmitter.emit('event6');
		Assert.strictEqual(storedEvent.identifier, 'event6', 'identifier is set correctly');

		// Emit event 7
		await eventEmitter.emit('event7');
		Assert.strictEqual(storedEvent.identifier, 'event7', 'identifier is set correctly');

		// Add events using an array with strings with multiple events and regular expressions
		eventEmitter.on(['event8 event9', 'event10, event11', /event12/gi], function(event) {
			storedEvent = event;
		});

		// List bound event listeners
		var eventListeners = eventEmitter.getEventListeners();
		//app.info('eventListeners', eventListeners);
		Assert.strictEqual(eventListeners.length, 12, 'The correct number of event listeners are bound');

		// Emit event 8
		await eventEmitter.emit('event8');
		Assert.strictEqual(storedEvent.identifier, 'event8', 'identifier is set correctly');

		// Emit event 9
		await eventEmitter.emit('event9');
		Assert.strictEqual(storedEvent.identifier, 'event9', 'identifier is set correctly');

		// Emit event 10
		await eventEmitter.emit('event10');
		Assert.strictEqual(storedEvent.identifier, 'event10', 'identifier is set correctly');

		// Emit event 11
		await eventEmitter.emit('event11');
		Assert.strictEqual(storedEvent.identifier, 'event11', 'identifier is set correctly');

		// Emit event 12
		await eventEmitter.emit('event12');
		Assert.strictEqual(storedEvent.identifier, 'event12', 'identifier is set correctly');

		//app.highlight(eventEmitter);
	}

	async testEmittingMultipleEvents() {
		// Create the EventEmitter
		var eventEmitter = new EventEmitter();

		// Variables used to store the events when emitted
		var storedEvent1 = null;
		var storedEvent2 = null;
		var storedEvent3 = null;
		var storedEvent4 = null;
		var storedEvent5 = null;
		var storedEvent6 = null;
		var storedEvent7 = null;

		// Store events
		eventEmitter.on('event1', function(event) {
			storedEvent1 = event;
		});
		eventEmitter.on('event2', function(event) {
			storedEvent2 = event;
		});
		eventEmitter.on('event3', function(event) {
			storedEvent3 = event;
		});
		eventEmitter.on('event4', function(event) {
			storedEvent4 = event;
		});
		eventEmitter.on('event5', function(event) {
			storedEvent5 = event;
		});
		eventEmitter.on('event6', function(event) {
			storedEvent6 = event;
		});
		eventEmitter.on('event7', function(event) {
			storedEvent7 = event;
		});

		// Emit the events using an array
		await eventEmitter.emit(['event1', 'event2', 'event3']);
		Assert.strictEqual(storedEvent1.identifier, 'event1', 'identifier is set correctly');
		Assert.strictEqual(storedEvent2.identifier, 'event2', 'identifier is set correctly');
		Assert.strictEqual(storedEvent3.identifier, 'event3', 'identifier is set correctly');

		// Emit the events using a string
		await eventEmitter.emit('event4,event5, event6 event7');
		Assert.strictEqual(storedEvent4.identifier, 'event4', 'identifier is set correctly');
		Assert.strictEqual(storedEvent5.identifier, 'event5', 'identifier is set correctly');
		Assert.strictEqual(storedEvent6.identifier, 'event6', 'identifier is set correctly');
		Assert.strictEqual(storedEvent7.identifier, 'event7', 'identifier is set correctly');
	}

	async testWildcardEventPattern() {
		// Create the EventEmitter
		var eventEmitter = new EventEmitter();

		// Variable used to store the event when it is emitted
		var storedEvent = null;

		// Declare the function to bind
		var functionToBind = function(event) {
			storedEvent = event;
		};

		// Bind the function to an event
		eventEmitter.on('event1.*', functionToBind);

		// List bound event listeners
		var eventListeners = eventEmitter.getEventListeners();
		//app.info('eventListeners', eventListeners);
		Assert.strictEqual(eventListeners.length, 1, 'One event listener is bound');

		// Emit a non-matching event
		await eventEmitter.emit('event');
		Assert.strictEqual(storedEvent, null, 'Non-matching event pattern does not trigger event listener');

		// Emit a matching event
		await eventEmitter.emit('event1');
		Assert.strictEqual(storedEvent.identifier, 'event1', 'Matching event pattern triggers event listener');
	}

	async testRegularExpressionEventPattern() {
		// Create the EventEmitter
		var eventEmitter = new EventEmitter();

		// Variable used to store the event when it is emitted
		var storedEvent = null;

		// Declare the function to bind
		var functionToBind = function(event) {
			storedEvent = event;
		};

		// Bind the function to an event
		eventEmitter.on(/(event1|event2)/, functionToBind);

		// List bound event listeners
		var eventListeners = eventEmitter.getEventListeners();
		//app.info('eventListeners', eventListeners);
		Assert.strictEqual(eventListeners.length, 1, 'One event listener is bound');

		// Emit a non-matching event
		await eventEmitter.emit('event');
		Assert.strictEqual(storedEvent, null, 'Non-matching event pattern does not trigger event listener');

		// Emit a matching event
		await eventEmitter.emit('event2');
		//app.info(storedEvent);
		Assert.strictEqual(storedEvent.identifier, 'event2', 'Matching event pattern triggers event listener');
	}

	// If an EventEmitter does not have at least one listener registered for the 'error' event, and an 'error' event is emitted, the error is thrown, a stack trace is printed, and the Node.js process exits
	async testThrowsErrorWithoutRegisteredListeners() {
		var eventEmitter = new EventEmitter();

		await Assert.throwsAsynchronously(async function() {
			await eventEmitter.emit('event1', new Error());
		}, 'Throw an error when an event is emitted with data being an instance of Error and there are no event listeners');
	}

}

// Export
export default EventEmitterTest;
