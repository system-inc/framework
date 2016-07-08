// Dependencies
var ElectronTest = Framework.require('system/electron/tests/ElectronTest.js');
var Assert = Framework.require('system/test/Assert.js');
var HtmlDocument = Framework.require('system/html/HtmlDocument.js');
var Html = Framework.require('system/html/Html.js');
var ElectronManager = null;
var CompositionEvent = Framework.require('system/html/events/html-element/input/InputComposeEvent.js');

// Class
var InputComposeEventTest = ElectronTest.extend({

	before: function*() {
		// Initialize the ElectronManager here as to not throw an exception when electron is not present
		ElectronManager = Framework.require('system/electron/ElectronManager.js');
	},

	testCompositionEvent: function*() {
		// Create an HtmlDocument
        var htmlDocument = new HtmlDocument();

		// Create a text area with some text        
        var textAreaElement = Html.textarea();
        textAreaElement.setStyle('width', '320px;')
        textAreaElement.setStyle('height', '240px;')

		// Append the form to the HtmlDocument body
		htmlDocument.body.append(textAreaElement);

		// Set a variable to capture the event
		var capturedCompositionStartEvent = null;
		var capturedCompositionUpdateEvent = null;
		var capturedCompositionEndEvent = null;

		// Testing
		textAreaElement.on('input.key.*', function(event) {
			Console.standardInfo(event.identifier, event);
		});

		// Add an event listener to the textarea to capture the event when triggered
		textAreaElement.on('input.compose.*', function(event) {
			Console.standardInfo(event.identifier, event);

			if(event.identifier == 'input.compose.start') {
				capturedCompositionStartEvent = event;
			}
			else if(event.identifier == 'input.compose.update') {
				capturedCompositionUpdateEvent = event;
			}
			else if(event.identifier == 'input.compose') {
				capturedCompositionEndEvent = event;
			}
		});

		// Mount the HtmlDocument to the DOM
        htmlDocument.mountToDom();

        // Click into the text area
        yield ElectronManager.doubleClickHtmlElement(textAreaElement);

        // Start composing
		// How to trigger a input.compose event? This doesn't do it
        yield ElectronManager.pressKey('a');

		//Assert.true(Class.isInstance(capturedCompositionStartEvent, CompositionEvent), '"input.compose.start" events are instances of CompositionEvent');
		//Assert.true(Class.isInstance(capturedCompositionUpdateEvent, CompositionEvent), '"input.compose.update" events are instances of CompositionEvent');
		//Assert.true(Class.isInstance(capturedCompositionEndEvent, CompositionEvent), '"input.compose.end" events are instances of CompositionEvent');

		//throw new Error('Throwing error to display browser window.');
	},

});

// Export
module.exports = InputComposeEventTest;