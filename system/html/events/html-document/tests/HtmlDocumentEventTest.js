// Dependencies
var ElectronTest = Framework.require('system/electron/tests/ElectronTest.js');
var Assert = Framework.require('system/test/Assert.js');
var HtmlDocument = Framework.require('system/html/HtmlDocument.js');
var Html = Framework.require('system/html/Html.js');
var ElectronManager = null;
var HtmlDocumentEvent = Framework.require('system/html/events/html-document/HtmlDocumentEvent.js');

// Class
var FormEventTest = ElectronTest.extend({

	before: function*() {
		// Initialize the ElectronManager here as to not throw an exception when electron is not present
		ElectronManager = Framework.require('system/electron/ElectronManager.js');
	},

	testHtmlDocumentEvent: function*() {
		// Create an HtmlDocument
        var htmlDocument = new HtmlDocument();

        // Set a variable to capture the event
		var capturedMountedToDomEvent = null;
		var capturedDomUpdatesExecutedEvent = null;

        htmlDocument.on('htmlDocument.mountedToDom', function(event) {
        	Console.standardWarn(event.identifier, event);
        	capturedMountedToDomEvent = event;
        });

        htmlDocument.on('htmlDocument.domUpdatesExecuted', function(event) {
        	Console.standardWarn(event.identifier, event);
        	capturedDomUpdatesExecutedEvent = event;
        });

		// Mount the HtmlDocument to the DOM
        htmlDocument.mountToDom();

        // capturedMountedToDomEvent should be an HtmlDocumentEvent
        Assert.true(Class.isInstance(capturedMountedToDomEvent, HtmlDocumentEvent), '"htmlDocument.mountedToDom" events are instances of HtmlDocumentEvent');

        // capturedDomUpdatesExecutedEvent should be an HtmlDocumentEvent
        Assert.true(Class.isInstance(capturedDomUpdatesExecutedEvent, HtmlDocumentEvent), '"htmlDocument.domUpdatesExecuted" events are instances of HtmlDocumentEvent');

		//throw new Error('Throwing error to display browser window.');
	},

});

// Export
module.exports = FormEventTest;

//keyboard.key.rightArrow.up