// Dependencies
var HtmlEventEmitter = Framework.require('system/html/events/HtmlEventEmitter.js');
var HtmlDocumentEvent = Framework.require('system/html/events/HtmlDocumentEvent.js');
var HtmlEventProxy = Framework.require('system/html/events/HtmlEventProxy.js');

// Class
var HtmlDocumentEventEmitter = HtmlEventEmitter.extend({

	createEvent: function(emitter, eventIdentifier, data, eventOptions) {
		var event = new HtmlDocumentEvent(emitter, eventIdentifier, data, eventOptions);

		return event;
	},

	addEventListener: function(eventPattern, functionToBind, timesToRun) {
		// Special case for htmlDocument.ready
		if(eventPattern == 'htmlDocument.ready') {
			// If the document is already ready, just run the function
			if(this.domDocument && this.domDocument.readyState == 'complete') {
				Console.log('Not sure if I like this - but the DOM already ready (readyState is complete), running function without adding event listener');
				functionToBind();
			}
		}
		else {
			//Console.log('HtmlDocument.addEventListener', eventPattern);
			HtmlEventProxy.addEventListener(eventPattern, functionToBind, timesToRun, this);	
		}

		return this;
	},

});

// Static methods

HtmlDocumentEventEmitter.is = function(value) {
	return Class.isInstance(value, HtmlDocumentEventEmitter);
};

// Export
module.exports = HtmlDocumentEventEmitter;