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
		propagatingEventEmitter1.name = 'propagatingEventEmitter1';
		var propagatingEventEmitter2 = new PropagatingEventEmitter();
		propagatingEventEmitter2.name = 'propagatingEventEmitter2';
		var propagatingEventEmitter3 = new PropagatingEventEmitter();
		propagatingEventEmitter3.name = 'propagatingEventEmitter3';
		propagatingEventEmitter3.parent = propagatingEventEmitter2;
		propagatingEventEmitter2.parent = propagatingEventEmitter1;

		// A variable to store events
		var propagatingEventEmitter1StoredEvent = null;
		var propagatingEventEmitter1StoredEventCounter = 0;
		var propagatingEventEmitter1StoredCurrentPhase = null;
		var propagatingEventEmitter2StoredEvent = null;
		var propagatingEventEmitter2StoredEventCounter = 0;
		var propagatingEventEmitter2StoredCurrentPhase = null;
		var propagatingEventEmitter3StoredEvent = null;
		var propagatingEventEmitter3StoredEventCounter = 0;
		var propagatingEventEmitter3StoredCurrentPhase = null;

		// Store event at level 3
		propagatingEventEmitter3.on('event', function(event) {
			Console.log('level3!', event.currentEmitter.name, event.currentPhase);
			propagatingEventEmitter3StoredEventCounter++;
			propagatingEventEmitter3StoredEvent = event;
			propagatingEventEmitter3StoredCurrentPhase = event.currentPhase;
		});

		// Store event at level 2
		propagatingEventEmitter2.on('event', function(event) {
			Console.log('level2!', event.currentEmitter.name, event.currentPhase);
			propagatingEventEmitter2StoredEventCounter++;
			propagatingEventEmitter2StoredEvent = event;
			propagatingEventEmitter2StoredCurrentPhase = event.currentPhase;
		});

		// Store event at level 1
		propagatingEventEmitter1.on('event', function(event) {
			Console.log('level1!', event.currentEmitter.name, event.currentPhase);
			propagatingEventEmitter1StoredEventCounter++;
			propagatingEventEmitter1StoredEvent = event;
			propagatingEventEmitter1StoredCurrentPhase = event.currentPhase;
		});

		// Emit event at level 3
		yield propagatingEventEmitter3.emit('event', 'propagatingEventEmitter3');

		Console.log('propagatingEventEmitter3StoredCurrentPhase', propagatingEventEmitter3StoredCurrentPhase);
		Console.log('propagatingEventEmitter2StoredCurrentPhase', propagatingEventEmitter2StoredCurrentPhase);
		Console.log('propagatingEventEmitter1StoredCurrentPhase', propagatingEventEmitter1StoredCurrentPhase);
		
		//Console.info(propagatingEventEmitter3StoredEvent);
		//Console.info(propagatingEventEmitter2StoredEvent);
		//Console.info(propagatingEventEmitter1StoredEvent);
		
		// Level 3
		Assert.true(PropagatingEvent.is(propagatingEventEmitter1StoredEvent), 'Event emitted from PropagatingEventEmitter is a PropagatingEvent');
		Assert.strictEqual(propagatingEventEmitter3StoredCurrentPhase, PropagatingEvent.phases.atEmitter, 'currentPhase is set correctly');
		
		// Level 2 - Level 3 event should have bubbled up to level 2
		Assert.strictEqual(propagatingEventEmitter2StoredEvent.data, 'propagatingEventEmitter3', 'Event bubbled one level');
		Assert.strictEqual(propagatingEventEmitter2StoredEventCounter, 1, 'Event only triggered once');
		Assert.strictEqual(propagatingEventEmitter2StoredCurrentPhase, PropagatingEvent.phases.bubbling, 'currentPhase is set correctly');

		// Level 1- Level 3 event should have bubbled up to level 1
		Assert.strictEqual(propagatingEventEmitter1StoredEvent.data, 'propagatingEventEmitter3', 'Event bubbled two levels');
		Assert.strictEqual(propagatingEventEmitter1StoredEventCounter, 1, 'Event only triggered once');
		Assert.strictEqual(propagatingEventEmitter1StoredCurrentPhase, PropagatingEvent.phases.bubbling, 'currentPhase is set correctly');
	},

	testStopPropagationMethod: function*() {
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
			event.stopPropagation();
			propagatingEventEmitter2StoredEventCounter++;
			propagatingEventEmitter2StoredEvent = event;
		});

		// Emit event at level 3
		yield propagatingEventEmitter3.emit('event', 'propagatingEventEmitter3');
		//Console.info(propagatingEventEmitter1StoredEvent);
		//Console.info(propagatingEventEmitter2StoredEvent);

		// Level 3 event should have bubbled up to level 2 and not level 1
		Assert.strictEqual(propagatingEventEmitter2StoredEventCounter, 1, 'Event only triggered once');
		Assert.strictEqual(propagatingEventEmitter2StoredEvent.data, 'propagatingEventEmitter3', 'Event bubbled one level');
		Assert.strictEqual(propagatingEventEmitter1StoredEvent, null, '.stopPropagation() prevents the event from propagating');
	},

	testEventOptionPropagationStopped: function*() {
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
		var propagatingEventEmitter3StoredEvent = null;
		var propagatingEventEmitter3StoredEventCounter = 0;

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

		// Store event at level 3
		propagatingEventEmitter3.on('event', function(event) {
			propagatingEventEmitter3StoredEventCounter++;
			propagatingEventEmitter3StoredEvent = event;
		});

		// Emit event at level 3
		yield propagatingEventEmitter3.emit('event', 'propagatingEventEmitter3', {
			propagationStopped: true,
		});
		//Console.info(propagatingEventEmitter1StoredEvent);
		//Console.info(propagatingEventEmitter2StoredEvent);
		//Console.info(propagatingEventEmitter3StoredEvent);

		// The event should not propagate
		Assert.strictEqual(propagatingEventEmitter3StoredEvent.data, 'propagatingEventEmitter3', 'Event option "propagationStopped" does not stop the first event listeners from executing');
		Assert.strictEqual(propagatingEventEmitter2StoredEvent, null, 'Event option "propagationStopped" prevents the event from propagating');
		Assert.strictEqual(propagatingEventEmitter1StoredEvent, null, 'Event option "propagationStopped" prevents the event from propagating');
	},

});

// Export
module.exports = PropagatingEventEmitterTest;