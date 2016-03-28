// Dependencies
var Test = Framework.require('system/test/Test.js');
var Assert = Framework.require('system/test/Assert.js');
var EventEmitter = Framework.require('system/events/EventEmitter.js');
var Event = Framework.require('system/events/Event.js');

// Class
var EventEmitterTest = Test.extend({

	testEventEmitter: function*() {
		var actual = null;
		var eventEmitter = new EventEmitter();

		eventEmitter.on('event1', function(event) {
			actual = event;
		});

		yield eventEmitter.emit('event1', 'event1Data');

		Assert.true(Event.is(actual), 'EventEmitter emitted an instance of Event');
		Assert.strictEqual(actual.data, 'event1Data', 'Event data is set correctly');

		//console.log('actual', actual);
	},

	/*

	test .once

	*/

});

// Export
module.exports = EventEmitterTest;