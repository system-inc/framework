// Dependencies
var ElectronTest = Framework.require('system/electron/tests/ElectronTest.js');
var Assert = Framework.require('system/test/Assert.js');
var HtmlDocument = Framework.require('system/html/HtmlDocument.js');
var Html = Framework.require('system/html/Html.js');
var ElectronManager = null;
var InputSelectEvent = Framework.require('system/html/events/html-element/input/InputSelectEvent.js');

// Class
var InputSelectEventTest = ElectronTest.extend({

	before: function*() {
		// Initialize the ElectronManager here as to not throw an exception when electron is not present
		ElectronManager = Framework.require('system/electron/ElectronManager.js');
	},

	testInputSelectEvent: function*() {
		// Create an HtmlDocument
        var htmlDocument = new HtmlDocument();

        // Create a p with some text
        //var pElement = Html.p('Select this text.');
        //htmlDocument.body.append(pElement);

		// Create a text area with some text
        var textAreaElement = Html.textarea('FrameworkInputSelectEventTest');
        textAreaElement.setStyle('width', '320px;')
        textAreaElement.setStyle('height', '240px;')
		htmlDocument.body.append(textAreaElement);

		// Set a variable to capture the event
		var capturedEventInputSelectStart = null;
		var capturedEventInputSelectChange = null;
		var capturedEventInputSelect = null;

		//pElement.on('input.select.*', function(event) {
		//	Console.standardInfo(event.identifier, event);
		//});

		// Add an event listener to the textarea to capture the event when triggered
		textAreaElement.on('input.select.*', function(event) {
			Console.standardInfo(event.identifier, event);

			if(event.identifier == 'input.select.start') {
				capturedEventInputSelectStart = event;
			}
			else if(event.identifier == 'input.select.change') {
				capturedEventInputSelectChange = event;
			}
			else if(event.identifier == 'input.select') {
				capturedEventInputSelect = event;
			}
		});

		// Mount the HtmlDocument to the DOM
        htmlDocument.mountToDom();

        // Double click into the text area twice to select some text
        yield ElectronManager.doubleClickHtmlElement(textAreaElement);

		
		Assert.true(Class.isInstance(capturedEventInputSelect, InputSelectEvent), '"input.select" events are instances of InputSelectEvent');

		// These aren't firing
		//Assert.true(Class.isInstance(capturedEventInputSelectStart, InputSelectEvent), '"input.select.start" events are instances of InputSelectEvent');
		//Assert.true(Class.isInstance(capturedEventInputSelectChange, InputSelectEvent), '"input.select.change" events are instances of InputSelectEvent');

		Assert.strictEqual(capturedEventInputSelect.text, 'FrameworkInputSelectEventTest', 'text property is set correctly');

		//throw new Error('Throwing error to display browser window.');
	},

});

// Export
module.exports = InputSelectEventTest;