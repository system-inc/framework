// Dependencies
import ElectronTest from 'framework/system/interface/graphical/electron/tests/ElectronTest.js';
import Assert from 'framework/system/test/Assert.js';
import HtmlDocument from 'framework/system/interface/graphical/web/html/HtmlDocument.js';
import Html from 'framework/system/interface/graphical/web/html/Html.js';
import ClipboardEvent from 'framework/system/interface/graphical/web/html/events/html-event/ClipboardEvent.js';
var ElectronManager = null;

// Class
class ClipboardEventTest extends ElectronTest {

	async before() {
		// Initialize the ElectronManager here as to not throw an exception when electron is not present
		ElectronManager = Framework.require('framework/system/electron/ElectronManager.js');
	}

	async testClipboardEvent() {
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

		// Testing
		textAreaElement.on('input.key.*', function(event) {
			console.info(event.identifier, event);
		});

		// Add an event listener to the textarea to capture the event when triggered
		textAreaElement.on('clipboard.*', function(event) {
			console.info(event.identifier, event);

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
        await ElectronManager.doubleClickHtmlElement(textAreaElement);

        // This only works on Windows right now
		//await ElectronManager.copyUsingKeyboard();
		//await ElectronManager.cutUsingKeyboard();
		//await ElectronManager.pasteUsingKeyboard();

		htmlDocument.executeCopy();
		htmlDocument.executeCut();
		htmlDocument.executePaste();

		Assert.true(Class.isInstance(capturedClipboardCopyEvent, ClipboardEvent), '"clipboard.copy" events are instances of ClipboardEvent');
		Assert.true(Class.isInstance(capturedClipboardCutEvent, ClipboardEvent), '"clipboard.cut" events are instances of ClipboardEvent');
		Assert.true(Class.isInstance(capturedClipboardPasteEvent, ClipboardEvent), '"clipboard.paste" events are instances of ClipboardEvent');

		//throw new Error('Throwing error to display browser window.');
	}

}

// Export
export default ClipboardEventTest;
