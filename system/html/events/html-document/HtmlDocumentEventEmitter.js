// Dependencies
var HtmlEventEmitter = Framework.require('system/html/events/html-event/HtmlEventEmitter.js');
var HtmlDocumentEvent = Framework.require('system/html/events/html-document/HtmlDocumentEvent.js');

// Class
var HtmlDocumentEventEmitter = HtmlEventEmitter.extend({

	eventClass: HtmlDocumentEvent,

	addEventListener: function(eventPattern, functionToBind, timesToRun) {
		// Special case for htmlDocument.ready
		if(eventPattern == 'htmlDocument.ready') {
			// If the document is already ready, just run the function
			if(this.domDocument && (this.domDocument.readyState == 'interactive' || this.domDocument.readyState == 'complete')) {
				functionToBind();
			}
		}
		// Special case for htmlDocument.loaded
		else if(eventPattern == 'htmlDocument.loaded') {
			// If the document is already loaded, just run the function
			if(this.domDocument && this.domDocument.readyState == 'complete') {
				functionToBind();
			}
		}
		
		// Add the event listener
		return this.super.apply(this, arguments);
	},

});

// Static methods

HtmlDocumentEventEmitter.is = function(value) {
	return Class.isInstance(value, HtmlDocumentEventEmitter);
};

// Export
module.exports = HtmlDocumentEventEmitter;