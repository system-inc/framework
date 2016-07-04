// Dependencies
var PropagatingEventEmitter = Framework.require('system/events/PropagatingEventEmitter.js');
var HtmlEvent = Framework.require('system/html/events/HtmlEvent.js');
var HtmlEventProxy = Framework.require('system/html/events/HtmlEventProxy.js');

// Class
var HtmlEventEmitter = PropagatingEventEmitter.extend({

	eventClass: HtmlEvent,

	addEventListener: function(eventPattern, functionToBind, timesToRun) {
		// All events are routed through the HtmlEventProxy
		return HtmlEventProxy.addEventListener(eventPattern, functionToBind, timesToRun, this);
	},

});

// Static methods

HtmlEventEmitter.is = function(value) {
	return Class.isInstance(value, HtmlEventEmitter);
};

// Export
module.exports = HtmlEventEmitter;