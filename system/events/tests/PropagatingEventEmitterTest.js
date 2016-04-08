// Dependencies
var Test = Framework.require('system/test/Test.js');
var Assert = Framework.require('system/test/Assert.js');
var PropagatingEventEmitter = Framework.require('system/events/PropagatingEventEmitter.js');
var PropagatingEvent = Framework.require('system/events/PropagatingEvent.js');

// Class
var PropagatingEventEmitterTest = Test.extend({

	testCoreEventPropagatingEmitterFunctionality: function*() {
		// Create the hierarchy
		var propagatingEventEmitter1 = new PropagatingEventEmitter();
		var propagatingEventEmitter2 = new PropagatingEventEmitter();
		var propagatingEventEmitter3 = new PropagatingEventEmitter();
		propagatingEventEmitter3.parent = propagatingEventEmitter2;
		propagatingEventEmitter2.parent = propagatingEventEmitter1;

		// A variable to capture events
		var propagatingEventEmitter1CapturedEvent = null;
		var propagatingEventEmitter1CapturedEventCounter = 0;
		var propagatingEventEmitter2CapturedEvent = null;
		var propagatingEventEmitter2CapturedEventCounter = 0;

		// Capture event at level 1
		propagatingEventEmitter1.on('event', function(event) {
			propagatingEventEmitter1CapturedEventCounter++;
			propagatingEventEmitter1CapturedEvent = event;
		});

		// Capture event at level 2
		propagatingEventEmitter2.on('event', function(event) {
			propagatingEventEmitter2CapturedEventCounter++;
			propagatingEventEmitter2CapturedEvent = event;
		});

		// Emit event at level 3
		yield propagatingEventEmitter3.emit('event', 'propagatingEventEmitter3');

		// Level 3 event should have bubbled up to level 1
		Assert.true(PropagatingEvent.is(propagatingEventEmitter1CapturedEvent), 'Event emitted from PropagatingEventEmitter is a PropagatingEvent');
		Assert.strictEqual(propagatingEventEmitter2CapturedEvent.data, 'propagatingEventEmitter3', 'Event bubbled one level');
		Assert.strictEqual(propagatingEventEmitter2CapturedEventCounter, 1, 'Event only triggered once');
		Assert.strictEqual(propagatingEventEmitter1CapturedEvent.data, 'propagatingEventEmitter3', 'Event bubbled two levels');
		Assert.strictEqual(propagatingEventEmitter1CapturedEventCounter, 1, 'Event only triggered once');
	},

	// what is event.preventDefault?
	// what is event.stopPropagation?
	// what other properties are their of propagating events?

});

// Export
module.exports = PropagatingEventEmitterTest;