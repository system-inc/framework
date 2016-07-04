// Dependencies
var HtmlEventEmitter = Framework.require('system/html/events/HtmlEventEmitter.js');
var HtmlNodeEvent = Framework.require('system/html/events/html-node/HtmlNodeEvent.js');

// Class
var HtmlNodeEventEmitter = HtmlEventEmitter.extend({

	eventClass: HtmlNodeEvent,

});

// Static methods

HtmlNodeEventEmitter.is = function(value) {
	return Class.isInstance(value, HtmlNodeEventEmitter);
};

// Export
module.exports = HtmlNodeEventEmitter;