// Dependencies
import Test from 'system/test/Test.js';
import Assert from 'system/test/Assert.js';
import PropagatingEventEmitter from 'system/events/PropagatingEventEmitter.js';
import PropagatingEvent from 'system/events/PropagatingEvent.js';

// Class
class PropagatingEventEmitterTest extends Test {

	async testCorePropagatingEventEmitterFunctionality() {
		// Create the hierarchy
		var propagatingEventEmitter1 = new PropagatingEventEmitter();
		var propagatingEventEmitter2 = new PropagatingEventEmitter();
		var propagatingEventEmitter3 = new PropagatingEventEmitter();
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
			//app.log('level3!', event.currentPhase);
			propagatingEventEmitter3StoredEventCounter++;
			propagatingEventEmitter3StoredEvent = event;
			propagatingEventEmitter3StoredCurrentPhase = event.currentPhase;
		});

		// Store event at level 2
		propagatingEventEmitter2.on('event', function(event) {
			//app.log('level2!', event.currentPhase);
			propagatingEventEmitter2StoredEventCounter++;
			propagatingEventEmitter2StoredEvent = event;
			propagatingEventEmitter2StoredCurrentPhase = event.currentPhase;
		});

		// Store event at level 1
		propagatingEventEmitter1.on('event', function(event) {
			//app.log('level1!', event.currentPhase);
			propagatingEventEmitter1StoredEventCounter++;
			propagatingEventEmitter1StoredEvent = event;
			propagatingEventEmitter1StoredCurrentPhase = event.currentPhase;
		});

		// Emit event at level 3
		await propagatingEventEmitter3.emit('event', 'propagatingEventEmitter3');

		//app.log('propagatingEventEmitter3StoredCurrentPhase', propagatingEventEmitter3StoredCurrentPhase);
		//app.log('propagatingEventEmitter2StoredCurrentPhase', propagatingEventEmitter2StoredCurrentPhase);
		//app.log('propagatingEventEmitter1StoredCurrentPhase', propagatingEventEmitter1StoredCurrentPhase);
		
		//app.info(propagatingEventEmitter3StoredEvent);
		//app.info(propagatingEventEmitter2StoredEvent);
		//app.info(propagatingEventEmitter1StoredEvent);
		
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
	}

	async testStopPropagationMethod() {
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
		await propagatingEventEmitter3.emit('event', 'propagatingEventEmitter3');
		//app.info(propagatingEventEmitter1StoredEvent);
		//app.info(propagatingEventEmitter2StoredEvent);

		// Level 3 event should have bubbled up to level 2 and not level 1
		Assert.strictEqual(propagatingEventEmitter2StoredEventCounter, 1, 'Event only triggered once');
		Assert.strictEqual(propagatingEventEmitter2StoredEvent.data, 'propagatingEventEmitter3', 'Event bubbled one level');
		Assert.strictEqual(propagatingEventEmitter1StoredEvent, null, '.stopPropagation() prevents the event from propagating');
	}

	async testEventOptionPropagationStopped() {
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
		await propagatingEventEmitter3.emit('event', 'propagatingEventEmitter3', {
			propagationStopped: true,
		});
		//app.info(propagatingEventEmitter1StoredEvent);
		//app.info(propagatingEventEmitter2StoredEvent);
		//app.info(propagatingEventEmitter3StoredEvent);

		// The event should not propagate
		Assert.strictEqual(propagatingEventEmitter3StoredEvent.data, 'propagatingEventEmitter3', 'Event option "propagationStopped" does not stop the first event listeners from executing');
		Assert.strictEqual(propagatingEventEmitter2StoredEvent, null, 'Event option "propagationStopped" prevents the event from propagating');
		Assert.strictEqual(propagatingEventEmitter1StoredEvent, null, 'Event option "propagationStopped" prevents the event from propagating');
	}

	async testEventBubbling() {
		// Create the PropagatingEventEmitter
		var propagatingEventEmitterChild = new PropagatingEventEmitter();
		propagatingEventEmitterChild.name = 'propagatingEventEmitterChild';
		var propagatingEventEmitterParent = new PropagatingEventEmitter();
		propagatingEventEmitterParent.name = 'propagatingEventEmitterParent';
		propagatingEventEmitterChild.parent = propagatingEventEmitterParent;

		// Variable used to store references for emitted events
		var storedEventForPropagatingEventEmitterChild = null;
		var storedEventEmitterForPropagatingEventEmitterChild = null;
		var storedEventCurrentEmitterForPropagatingEventEmitterChild = null;
		var storedEventForPropagatingEventEmitterParent = null;
		var storedEventEmitterForPropagatingEventEmitterParent = null;
		var storedEventCurrentEmitterForPropagatingEventEmitterParent = null;

		// Listen for events to store
		propagatingEventEmitterChild.on('event', function(event) {
			storedEventForPropagatingEventEmitterChild = event;
			storedEventEmitterForPropagatingEventEmitterChild = event.emitter;
			storedEventCurrentEmitterForPropagatingEventEmitterChild = event.currentEmitter;
		});
		propagatingEventEmitterParent.on('event', function(event) {
			storedEventForPropagatingEventEmitterParent = event;
			storedEventEmitterForPropagatingEventEmitterParent = event.emitter;
			storedEventCurrentEmitterForPropagatingEventEmitterParent = event.currentEmitter;
		});

		// Emit an event
		var emittedEventForPropagatingEventEmitterChild = await propagatingEventEmitterChild.emit('event', 'eventData');

		Assert.strictEqual(storedEventForPropagatingEventEmitterChild, emittedEventForPropagatingEventEmitterChild, '.emit() returns the emitted event');
		Assert.strictEqual(storedEventEmitterForPropagatingEventEmitterChild, propagatingEventEmitterChild, 'emitter is set correctly');
		Assert.strictEqual(storedEventCurrentEmitterForPropagatingEventEmitterChild, propagatingEventEmitterChild, 'currentEmitter is set correctly');

		// The event should have bubbled
		Assert.strictEqual(storedEventForPropagatingEventEmitterParent, emittedEventForPropagatingEventEmitterChild, '.emit() returns the emitted event');
		Assert.strictEqual(storedEventEmitterForPropagatingEventEmitterParent, propagatingEventEmitterChild, 'emitter is set correctly');
		Assert.strictEqual(storedEventCurrentEmitterForPropagatingEventEmitterParent, propagatingEventEmitterParent, 'currentEmitter is set correctly');
	}

	async testSkipBubblingPhase() {
		// Create the hierarchy
		var propagatingEventEmitter3 = new PropagatingEventEmitter();
		var propagatingEventEmitter2 = new PropagatingEventEmitter();
		propagatingEventEmitter3.parent = propagatingEventEmitter2;
		var propagatingEventEmitter1 = new PropagatingEventEmitter();
		propagatingEventEmitter2.parent = propagatingEventEmitter1;

		// A variable to store events
		var propagatingEventEmitter1StoredEvent = null;
		var propagatingEventEmitter1StoredEventCounter = 0;
		var propagatingEventEmitter2StoredEvent = null;
		var propagatingEventEmitter2StoredEventCounter = 0;
		var propagatingEventEmitter3StoredEvent = null;
		var propagatingEventEmitter3StoredEventCounter = 0;

		// Level 3
		propagatingEventEmitter3.on('event', function(event) {
			//app.log('Level 3!', event.currentPhase);
			propagatingEventEmitter3StoredEventCounter++;
			propagatingEventEmitter3StoredEvent = event;
		});

		// Level 2
		propagatingEventEmitter2.on('event', function(event) {
			//app.log('Level 2!', event.currentPhase);
			propagatingEventEmitter2StoredEventCounter++;
			propagatingEventEmitter2StoredEvent = event;
		});

		// Level 1
		propagatingEventEmitter1.on('event', function(event) {
			//app.log('Level 1!', event.currentPhase);
			propagatingEventEmitter1StoredEventCounter++;
			propagatingEventEmitter1StoredEvent = event;
		});

		// Emit event at level 3
		await propagatingEventEmitter3.emit('event', 'propagatingEventEmitter3', {
			registeredPhases: {
				bubbling: false,
			},
		});

		//app.info(propagatingEventEmitter1StoredEvent);
		//app.info(propagatingEventEmitter2StoredEvent);
		//app.info(propagatingEventEmitter3StoredEvent);

		// The event should not bubble
		Assert.strictEqual(propagatingEventEmitter3StoredEvent.data, 'propagatingEventEmitter3', 'Event phase "atEmitter" works');
		Assert.strictEqual(propagatingEventEmitter2StoredEvent, null, 'Unregistering for the event phase "bubbling" prevents the event from bubbling');
		Assert.strictEqual(propagatingEventEmitter1StoredEvent, null, 'Unregistering for the event phase "bubbling" prevents the event from bubbling');
	}

	async testSkipAtEmitterPhase() {
		// Create the hierarchy
		var propagatingEventEmitter3 = new PropagatingEventEmitter();
		var propagatingEventEmitter2 = new PropagatingEventEmitter();
		propagatingEventEmitter3.parent = propagatingEventEmitter2;
		var propagatingEventEmitter1 = new PropagatingEventEmitter();
		propagatingEventEmitter2.parent = propagatingEventEmitter1;

		// A variable to store events
		var propagatingEventEmitter1StoredEvent = null;
		var propagatingEventEmitter1StoredEventCounter = 0;
		var propagatingEventEmitter2StoredEvent = null;
		var propagatingEventEmitter2StoredEventCounter = 0;
		var propagatingEventEmitter3StoredEvent = null;
		var propagatingEventEmitter3StoredEventCounter = 0;

		// Level 3
		propagatingEventEmitter3.on('event', function(event) {
			//app.log('Level 3!', event.currentPhase);
			propagatingEventEmitter3StoredEventCounter++;
			propagatingEventEmitter3StoredEvent = event;
		});

		// Level 2
		propagatingEventEmitter2.on('event', function(event) {
			//app.log('Level 2!', event.currentPhase);
			propagatingEventEmitter2StoredEventCounter++;
			propagatingEventEmitter2StoredEvent = event;
		});

		// Level 1
		propagatingEventEmitter1.on('event', function(event) {
			//app.log('Level 1!', event.currentPhase);
			propagatingEventEmitter1StoredEventCounter++;
			propagatingEventEmitter1StoredEvent = event;
		});

		// Emit event at level 3
		await propagatingEventEmitter3.emit('event', 'propagatingEventEmitter3', {
			registeredPhases: {
				atEmitter: false,
			},
		});

		//app.info(propagatingEventEmitter1StoredEvent);
		//app.info(propagatingEventEmitter2StoredEvent);
		//app.info(propagatingEventEmitter3StoredEvent);

		// The event should not bubble
		Assert.strictEqual(propagatingEventEmitter3StoredEvent, null, 'Event phase "atEmitter" does not trigger event listeners');
		Assert.strictEqual(propagatingEventEmitter2StoredEvent.data, 'propagatingEventEmitter3', 'Unregistering for the event phase "atEmitter" still allows event phase "bubbling"');
		Assert.strictEqual(propagatingEventEmitter1StoredEvent.data, 'propagatingEventEmitter3', 'Unregistering for the event phase "atEmitter" still allows event phase "bubbling"');
	}

	async testCapturingPhase() {
		// Create the hierarchy
		var propagatingEventEmitter3 = new PropagatingEventEmitter();
		propagatingEventEmitter3.name = 'propagatingEventEmitter3';
		var propagatingEventEmitter2 = new PropagatingEventEmitter();
		propagatingEventEmitter2.name = 'propagatingEventEmitter2';
		propagatingEventEmitter3.parent = propagatingEventEmitter2;
		var propagatingEventEmitter1 = new PropagatingEventEmitter();
		propagatingEventEmitter1.name = 'propagatingEventEmitter1';
		propagatingEventEmitter2.parent = propagatingEventEmitter1;

		// A variable to store events
		var propagatingEventEmitter1StoredEvent = null;
		var propagatingEventEmitter1StoredEventCurrentPhase = null;
		var propagatingEventEmitter1StoredEventCounter = 0;
		var propagatingEventEmitter2StoredEvent = null;
		var propagatingEventEmitter2StoredEventCurrentPhase = null;
		var propagatingEventEmitter2StoredEventCounter = 0;
		var propagatingEventEmitter3StoredEvent = null;
		var propagatingEventEmitter3StoredEventCurrentPhase = null;
		var propagatingEventEmitter3StoredEventCounter = 0;

		// Level 3 (atEmitter)
		propagatingEventEmitter3.on('event', function(event) {
			//app.log('Level 3!', event.currentPhase);
			propagatingEventEmitter3StoredEventCounter++;
			propagatingEventEmitter3StoredEvent = event;
			propagatingEventEmitter3StoredEventCurrentPhase = event.currentPhase;
		});

		// Level 2 (capturing)
		propagatingEventEmitter2.on('event', function(event) {
			//app.log('Level 2!', event.currentPhase);
			propagatingEventEmitter2StoredEventCounter++;
			propagatingEventEmitter2StoredEvent = event;
			propagatingEventEmitter2StoredEventCurrentPhase = event.currentPhase;
		});

		// Level 1 (capturing)
		propagatingEventEmitter1.on('event', function(event) {
			//app.log('Level 1!', event.currentPhase);
			propagatingEventEmitter1StoredEventCounter++;
			propagatingEventEmitter1StoredEvent = event;
			propagatingEventEmitter1StoredEventCurrentPhase = event.currentPhase;
		});

		// Emit event at level 3
		await propagatingEventEmitter3.emit('event', 'propagatingEventEmitter3', {
			registeredPhases: {
				capturing: true,
				bubbling: false,
			},
		});

		//app.info(propagatingEventEmitter1StoredEvent);
		//app.info(propagatingEventEmitter2StoredEvent);
		//app.info(propagatingEventEmitter3StoredEvent);

		Assert.strictEqual(propagatingEventEmitter3StoredEventCurrentPhase, 'atEmitter', 'currentPhase is set correctly');
		Assert.strictEqual(propagatingEventEmitter2StoredEventCurrentPhase, 'capturing', 'currentPhase is set correctly');
		Assert.strictEqual(propagatingEventEmitter1StoredEventCurrentPhase, 'capturing', 'currentPhase is set correctly');
	}

	async testSkipCapturingPhase() {
		// Create the hierarchy
		var propagatingEventEmitter3 = new PropagatingEventEmitter();
		propagatingEventEmitter3.name = 'propagatingEventEmitter3';
		var propagatingEventEmitter2 = new PropagatingEventEmitter();
		propagatingEventEmitter2.name = 'propagatingEventEmitter2';
		propagatingEventEmitter3.parent = propagatingEventEmitter2;
		var propagatingEventEmitter1 = new PropagatingEventEmitter();
		propagatingEventEmitter1.name = 'propagatingEventEmitter1';
		propagatingEventEmitter2.parent = propagatingEventEmitter1;

		// A variable to store events
		var propagatingEventEmitter1StoredEvent = null;
		var propagatingEventEmitter1StoredEventCurrentPhase = null;
		var propagatingEventEmitter1StoredEventCounter = 0;
		var propagatingEventEmitter2StoredEvent = null;
		var propagatingEventEmitter2StoredEventCurrentPhase = null;
		var propagatingEventEmitter2StoredEventCounter = 0;
		var propagatingEventEmitter3StoredEvent = null;
		var propagatingEventEmitter3StoredEventCurrentPhase = null;
		var propagatingEventEmitter3StoredEventCounter = 0;

		// Level 3
		propagatingEventEmitter3.on('event', function(event) {
			//app.log('Level 3!', event.currentPhase);
			propagatingEventEmitter3StoredEventCounter++;
			propagatingEventEmitter3StoredEvent = event;
			propagatingEventEmitter3StoredEventCurrentPhase = event.currentPhase;
		});

		// Level 2
		propagatingEventEmitter2.on('event', function(event) {
			//app.log('Level 2!', event.currentPhase);
			propagatingEventEmitter2StoredEventCounter++;
			propagatingEventEmitter2StoredEvent = event;
			propagatingEventEmitter2StoredEventCurrentPhase = event.currentPhase;
		});

		// Level 1
		propagatingEventEmitter1.on('event', function(event) {
			//app.log('Level 1!', event.currentPhase);
			propagatingEventEmitter1StoredEventCounter++;
			propagatingEventEmitter1StoredEvent = event;
			propagatingEventEmitter1StoredEventCurrentPhase = event.currentPhase;
		});

		// Emit event at level 3
		await propagatingEventEmitter3.emit('event', 'propagatingEventEmitter3', {
			registeredPhases: {
				capturing: false,
				atEmitter: true,
				bubbling: false,
			},
		});

		//app.info(propagatingEventEmitter1StoredEvent);
		//app.info(propagatingEventEmitter2StoredEvent);
		//app.info(propagatingEventEmitter3StoredEvent);

		Assert.strictEqual(propagatingEventEmitter3StoredEventCurrentPhase, 'atEmitter', '"atEmitter" phase not skipped');
		Assert.strictEqual(propagatingEventEmitter2StoredEventCurrentPhase, null, '"capturing" phase skipped');
		Assert.strictEqual(propagatingEventEmitter1StoredEventCurrentPhase, null, '"capturing" phase skipped');
	}

}

// Export
export default PropagatingEventEmitterTest;
