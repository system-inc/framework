// Dependencies
var Test = Framework.require('system/test/Test.js');
var Assert = Framework.require('system/test/Assert.js');
var PropagatingEvent = Framework.require('system/events/PropagatingEvent.js');

// Class
var PropagatingEventTest = Test.extend({

	testPropagatingEvent: function*() {
		var propagatingEvent = new PropagatingEvent();
	},

});

// Export
module.exports = PropagatingEventTest;