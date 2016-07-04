// Dependencies
var ElectronTest = Framework.require('system/electron/tests/ElectronTest.js');
var Assert = Framework.require('system/test/Assert.js');
var HtmlDocument = Framework.require('system/html/HtmlDocument.js');
var Html = Framework.require('system/html/Html.js');
var ElectronManager = null;
var SelectionEvent = Framework.require('system/html/events/web-interface/SelectionEvent.js');

// Class
var SelectionEventTest = ElectronTest.extend({

	before: function*() {
		// Initialize the ElectronManager here as to not throw an exception when electron is not present
		ElectronManager = Framework.require('system/electron/ElectronManager.js');
	},

	testSelectionEvent: function*() {
		// Create an HtmlDocument
        var htmlDocument = new HtmlDocument();

        // Create a p with some text
        //var pElement = Html.p('Select this text.');
        //htmlDocument.body.append(pElement);

		// Create a text area with some text
        var textAreaElement = Html.textarea('FrameworkSelectionEventTest');
        textAreaElement.setStyle('width', '320px;')
        textAreaElement.setStyle('height', '240px;')
		htmlDocument.body.append(textAreaElement);

		// Set a variable to capture the event
		var capturedSelectionStartEvent = null;
		var capturedSelectionChangeEvent = null;
		var capturedSelectionEndEvent = null;

		//pElement.on('selection.*', function(event) {
		//	Console.standardInfo(event.identifier, event);
		//});

		// Add an event listener to the textarea to capture the event when triggered
		textAreaElement.on('selection.*', function(event) {
			Console.standardInfo(event.identifier, event);

			if(event.identifier == 'selection.start') {
				capturedSelectionStartEvent = event;
			}
			else if(event.identifier == 'selection.update') {
				capturedSelectionChangeEvent = event;
			}
			else if(event.identifier == 'selection.end') {
				capturedSelectionEndEvent = event;
			}
		});

		// Mount the HtmlDocument to the DOM
        htmlDocument.mountToDom();

        // Double click into the text area twice to select some text
        yield ElectronManager.doubleClickHtmlElement(textAreaElement);

		//Assert.true(Class.isInstance(capturedSelectionStartEvent, SelectionEvent), '"selection.start" events are instances of SelectionEvent');
		//Assert.true(Class.isInstance(capturedSelectionChangeEvent, SelectionEvent), '"selection.update" events are instances of SelectionEvent');
		Assert.true(Class.isInstance(capturedSelectionEndEvent, SelectionEvent), '"selection.end" events are instances of SelectionEvent');

		Assert.strictEqual(capturedSelectionEndEvent.text, 'FrameworkSelectionEventTest', 'text property is set correctly');

		//throw new Error('Throwing error to display browser window.');
	},

});

// Export
module.exports = SelectionEventTest;