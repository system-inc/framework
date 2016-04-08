// Dependencies
var Test = Framework.require('system/test/Test.js');
var Assert = Framework.require('system/test/Assert.js');
var PropagatingEventEmitter = Framework.require('system/events/PropagatingEventEmitter.js');
var PropagatingEvent = Framework.require('system/events/PropagatingEvent.js');

// Class
var PropagatingEventEmitterTest = Test.extend({

	testCorePropagatingEventEmitterFunctionality: function*() {
		// Create the hierarchy
		var propagatingEventEmitter1 = new PropagatingEventEmitter();
		var propagatingEventEmitter2 = new PropagatingEventEmitter();
		var propagatingEventEmitter3 = new PropagatingEventEmitter();
		propagatingEventEmitter3.parent = propagatingEventEmitter2;
		propagatingEventEmitter2.parent = propagatingEventEmitter1;

		// A variable to store events
		var propagatingEventEmitter1StoredEvent = null;
		var propagatingEventEmitter1StoredEventCounter = 0;
		var propagatingEventEmitter2StoredEvent = null;
		var propagatingEventEmitter2StoredEventCounter = 0;

		// Store event at level 1
		propagatingEventEmitter1.on('event', function(event) {
			propagatingEventEmitter1StoredEventCounter++;
			propagatingEventEmitter1StoredEvent = event;
		});

		// Store event at level 2
		propagatingEventEmitter2.on('event', function(event) {
			propagatingEventEmitter2StoredEventCounter++;
			propagatingEventEmitter2StoredEvent = event;
		});

		// Emit event at level 3
		yield propagatingEventEmitter3.emit('event', 'propagatingEventEmitter3');
		//Console.info(propagatingEventEmitter1StoredEvent);
		//Console.info(propagatingEventEmitter2StoredEvent);

		// Level 3 event should have bubbled up to level 1
		Assert.true(PropagatingEvent.is(propagatingEventEmitter1StoredEvent), 'Event emitted from PropagatingEventEmitter is a PropagatingEvent');
		Assert.strictEqual(propagatingEventEmitter2StoredEvent.data, 'propagatingEventEmitter3', 'Event bubbled one level');
		Assert.strictEqual(propagatingEventEmitter2StoredEventCounter, 1, 'Event only triggered once');
		Assert.strictEqual(propagatingEventEmitter1StoredEvent.data, 'propagatingEventEmitter3', 'Event bubbled two levels');
		Assert.strictEqual(propagatingEventEmitter1StoredEventCounter, 1, 'Event only triggered once');
	},

});

// Export
module.exports = PropagatingEventEmitterTest;