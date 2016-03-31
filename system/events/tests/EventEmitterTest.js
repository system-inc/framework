// Dependencies
var Test = Framework.require('system/test/Test.js');
var Assert = Framework.require('system/test/Assert.js');
var EventEmitter = Framework.require('system/events/EventEmitter.js');
var Event = Framework.require('system/events/Event.js');

// Class
var EventEmitterTest = Test.extend({

	testEventEmitter: function*() {
		// Create the EventEmitter
		var eventEmitter = new EventEmitter();

		// List the event identifiers the EventEmitter handles
		var eventIdentifiers = eventEmitter.getEventIdentifiers();
		Assert.strictEqual(eventIdentifiers.length, 0, 'No event identifiers are set');

		// Variable used to store the event when it is emitted
		var capturedEvent = null;

		// Bind an event
		eventEmitter.on('event1', function(event) {
			capturedEvent = event;
		});

		// List the event identifiers the EventEmitter handles
		var eventIdentifiers = eventEmitter.getEventIdentifiers();
		// TODO: more assertions
		Assert.strictEqual(eventIdentifiers.length, 1, 'One event identifier is set');

		yield eventEmitter.emit('event1', 'event1Data');

		Assert.true(Event.is(capturedEvent), 'Emitted an instance of Event');
		Assert.strictEqual(capturedEvent.identifier, 'event1', 'identifier is set correctly');
		Assert.strictEqual(capturedEvent.data, 'event1Data', 'data is set correctly');

		//console.log('actual', actual);
	},

	/*

	If an EventEmitter does not have at least one listener registered for the 'error' event, and an 'error' event is emitted, the error is thrown, a stack trace is printed, and the Node.js process exits.
const myEmitter = new MyEmitter();
myEmitter.emit('error', new Error('whoops!'));
  // Throws and crashes Node.js
  When an EventEmitter instance experiences an error, the typical action is to emit an error event. Error events are treated as a special case. If there is no listener for it, then the default action is to print a stack trace and exit the program.

  All EventEmitters emit the event 'newListener' when new listeners are added and 'removeListener' when a listener is removed.


EventEmitter.defaultMaxListeners#
By default, a maximum of 10 listeners can be registered for any single event. This limit can be changed for individual EventEmitter instances using the emitter.setMaxListeners(n) method. To change the default for all EventEmitter instances, the EventEmitter.defaultMaxListenersproperty can be used.
Take caution when setting the EventEmitter.defaultMaxListeners because the change effects all EventEmitter instances, including those created before the change is made. However, calling emitter.setMaxListeners(n) still has precedence over EventEmitter.defaultMaxListeners.
Note that this is not a hard limit. The EventEmitter instance will allow more listeners to be added but will output a trace warning to stderr indicating that a possible EventEmitter memory leak has been detected. For any single EventEmitter, the emitter.getMaxListeners() andemitter.setMaxListeners() methods can be used to temporarily avoid this warning:

	test .once

	be able to list all of the events an emitter will emit and how many listeners they have

	emitter.listeners(event)
Returns an array of listeners for the specified event. This array can be manipulated, e.g. to remove listeners.
    server.on('get', function(value) {
      console.log('someone connected!');
    });
    console.log(server.listeners('get')); // [ [Function] ]


	Getting the actual event that fired.
    server.on('foo.*', function(event) {
      console.log(event);
    });

    server.off (alias for removeListener)

    Fire an event N times and then remove it, an extension of the once concept.
    server.many('foo', 4, function() {
      console.log('hello');
    });

	Namespaces with Wildcards To use namespaces/wildcards, pass the wildcard option into the EventEmitter constructor. When namespaces/wildcards are enabled, events can either be strings (foo.bar) separated by a delimiter or arrays (['foo', 'bar']). The delimiter is also configurable as a constructor option.

	An event name passed to any event emitter method can contain a wild card (the * character). If the event name is a string, a wildcard may appear as foo.*. If the event name is an array, the wildcard may appear as ['foo', '*'].

        server.many(['foo', 'bar', 'bazz'], function() {
      console.log('hello');
    });

    be able to supply a regex
    emitter.on(/myevent/g)

    emitter.addListener(event, callback

    removeListener
removeAllListeners
setMaximumListeners)

	warn when too many listeners are bound

	*/

});

// Export
module.exports = EventEmitterTest;