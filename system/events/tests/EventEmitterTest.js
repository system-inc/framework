// Dependencies
var Test = Framework.require('system/test/Test.js');
var Assert = Framework.require('system/test/Assert.js');
var EventEmitter = Framework.require('system/events/EventEmitter.js');

// Class
var EventEmitterTest = Test.extend({

	testEventEmitter: function() {
		var eventEmitter = new EventEmitter();
	},

});

// Export
module.exports = EventEmitterTest;