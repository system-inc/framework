// Dependencies
import { HtmlElectronTest } from '@framework/modules/electron/interface/graphical/web/html/tests/HtmlElectronTest.js';
import { Assert } from '@framework/system/test/Assert.js';

import { HtmlDocument } from '@framework/system/interface/graphical/web/html/HtmlDocument.js';
import { Html } from '@framework/system/interface/graphical/web/html/Html.js';
import { ClipboardEvent } from '@framework/system/interface/graphical/web/html/events/html-event/ClipboardEvent.js';

// Class
class ClipboardEventElectronTest extends HtmlElectronTest {

	async testClipboardEvent() {
		// Create an HtmlDocument
        var htmlDocument = new HtmlDocument();

		// Create a text area with some text        
        var textAreaElement = Html.textarea('FrameworkClipboardEventElectronTest');
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
        await this.inputPressDoubleHtmlNode(textAreaElement);

        // This only works on Windows right now
		//await app.modules.electronModule.copyUsingKeyboard();
		//await app.modules.electronModule.cutUsingKeyboard();
		//await app.modules.electronModule.pasteUsingKeyboard();

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
export { ClipboardEventElectronTest };
