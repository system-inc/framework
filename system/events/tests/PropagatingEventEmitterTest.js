// Dependencies
var Test = Framework.require('system/test/Test.js');
var Assert = Framework.require('system/test/Assert.js');
var PropagatingEventEmitter = Framework.require('system/events/PropagatingEventEmitter.js');
var PropagatingEvent = Framework.require('system/events/PropagatingEvent.js');

// Class
var PropagatingEventEmitterTest = Test.extend({

	testCoreEventPropagatingEmitterFunctionality: function*() {
		// Create the PropagatingEventEmitter
		var propagatingEventEmitter = new PropagatingEventEmitter();


	},

});

// Export
module.exports = PropagatingEventEmitterTest;