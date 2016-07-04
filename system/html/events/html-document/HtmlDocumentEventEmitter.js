// Dependencies
var HtmlEventEmitter = Framework.require('system/html/events/HtmlEventEmitter.js');
var HtmlDocumentEvent = Framework.require('system/html/events/html-document/HtmlDocumentEvent.js');

// Class
var HtmlDocumentEventEmitter = HtmlEventEmitter.extend({

	eventClass: HtmlDocumentEvent,

	addEventListener: function(eventPattern, functionToBind, timesToRun) {
		// Special case for htmlDocument.ready
		if(eventPattern == 'htmlDocument.ready') {
			// If the document is already ready, just run the function
			if(this.domDocument && this.domDocument.readyState == 'complete') {
				Console.log('Not sure if I like this - but the DOM already ready (readyState is complete), running function without adding event listener');
				functionToBind();
			}

			return this;
		}
		else {
			//Console.log('HtmlDocument.addEventListener', eventPattern);
			return this.super.apply(this, arguments);
		}
	},

});

// Static methods

HtmlDocumentEventEmitter.is = function(value) {
	return Class.isInstance(value, HtmlDocumentEventEmitter);
};

// Export
module.exports = HtmlDocumentEventEmitter;