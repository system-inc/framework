// Dependencies
var HtmlDocumentEvent = Framework.require('system/html/events/HtmlDocumentEvent.js');
var HtmlNodeEvent = Framework.require('system/html/events/HtmlNodeEvent.js');

// Class
var HtmlEventProxy = Class.extend({

});

// Static methods

HtmlEventProxy.is = function(value) {
	return Class.isInstance(value, HtmlEventProxy);
};

HtmlEventProxy.proxyEvent = function(emitter, htmlNode) {

};

// Export
module.exports = HtmlEventProxy;