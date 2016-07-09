// Dependencies
var PropagatingEventEmitter = Framework.require('system/events/PropagatingEventEmitter.js');
var HtmlEvent = Framework.require('system/html/events/html-event/HtmlEvent.js');
var HtmlEventProxy = Framework.require('system/html/events/HtmlEventProxy.js');

// Class
var HtmlEventEmitter = PropagatingEventEmitter.extend({

	eventClass: HtmlEvent,
	eventListenersOnDomObject: {},

	addEventListener: function(eventPattern, functionToBind, timesToRun) {
		// All events are routed through the HtmlEventProxy
		return HtmlEventProxy.addEventListener(eventPattern, functionToBind, timesToRun, this);
	},

	removeEventListener: function(eventPattern, functionToUnbind) {
		// Route this call through HtmlEventProxy
		return HtmlEventProxy.removeEventListener(eventPattern, functionToUnbind, this);
	},

	removeAllEventListeners: function() {
		// Route this call through HtmlEventProxy
		return HtmlEventProxy.removeAllEventListeners(this);
	},

});

// Static methods

HtmlEventEmitter.is = function(value) {
	return Class.isInstance(value, HtmlEventEmitter);
};

// Export
module.exports = HtmlEventEmitter;