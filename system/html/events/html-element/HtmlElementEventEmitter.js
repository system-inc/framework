// Dependencies
var HtmlNodeEventEmitter = Framework.require('system/html/events/html-node/HtmlNodeEventEmitter.js');
var HtmlElementEvent = Framework.require('system/html/events/html-element/HtmlElementEvent.js');

// Class
var HtmlElementEventEmitter = HtmlNodeEventEmitter.extend({

	eventClass: HtmlElementEvent,

});

// Static methods

HtmlElementEventEmitter.is = function(value) {
	return Class.isInstance(value, HtmlElementEventEmitter);
};

// Export
module.exports = HtmlElementEventEmitter;