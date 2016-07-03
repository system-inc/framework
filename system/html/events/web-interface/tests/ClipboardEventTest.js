// Dependencies
var ElectronTest = Framework.require('system/electron/tests/ElectronTest.js');
var Assert = Framework.require('system/test/Assert.js');
var HtmlDocument = Framework.require('system/html/HtmlDocument.js');
var Html = Framework.require('system/html/Html.js');
var ElectronManager = null;
var ClipboardEvent = Framework.require('system/html/events/web-interface/ClipboardEvent.js');

// Class
var ClipboardEventTest = ElectronTest.extend({

	before: function*() {
		// Initialize the ElectronManager here as to not throw an exception when electron is not present
		ElectronManager = Framework.require('system/electron/ElectronManager.js');
	},

	testClipboardEvent: function*() {
		// Create an HtmlDocument
        var htmlDocument = new HtmlDocument();

		// Create a text area with some text        
        var textAreaElement = Html.textarea('FrameworkClipboardEventTest');
        textAreaElement.setStyle('width', '320px;')
        textAreaElement.setStyle('height', '240px;')

		// Append the form to the HtmlDocument body
		htmlDocument.body.append(textAreaElement);

		// Set a variable to capture the event
		var capturedClipboardCopyEvent = null;
		var capturedClipboardCutEvent = null;
		var capturedClipboardPasteEvent = null;

		// Add an event listener to the textarea to capture the event when triggered
		textAreaElement.on('keyboard.key.*', function(event) {
			Console.standardInfo(event.identifier, event);
		});

		textAreaElement.on('clipboard.*', function(event) {
			Console.standardInfo(event.identifier, event);

			if(event.identifier == 'clipboard.copy') {
				capturedClipboardCopyEvent = event;
			}
			else if(event.identifier == 'clipboard.cut') {
				capturedClipboardCutEvent = event;
			}
			else if(event.identifier == 'clipboard.paste') {
				capturedClipboardPasteEvent = event;
			}
		});

		// Mount the HtmlDocument to the DOM
        htmlDocument.mountToDom();

        // Double click into the text area twice to select some text
        yield ElectronManager.doubleClickHtmlElement(textAreaElement);

        // This only works on Windows right now
		//yield ElectronManager.copyUsingKeyboard();
		//yield ElectronManager.cutUsingKeyboard();
		//yield ElectronManager.pasteUsingKeyboard();

		document.execCommand('copy', false, null);
		document.execCommand('cut', false, null);
		document.execCommand('paste', false, null);

		Assert.true(Class.isInstance(capturedClipboardCopyEvent, ClipboardEvent), '"clipboard.copy" events are instances of ClipboardEvent');
		Assert.true(Class.isInstance(capturedClipboardCutEvent, ClipboardEvent), '"clipboard.cut" events are instances of ClipboardEvent');
		Assert.true(Class.isInstance(capturedClipboardPasteEvent, ClipboardEvent), '"clipboard.paste" events are instances of ClipboardEvent');

		//throw new Error('Throwing error to display browser window.');
	},

});

// Export
module.exports = ClipboardEventTest;

//keyboard.key.rightArrow.up