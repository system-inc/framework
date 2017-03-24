// Dependencies
import ElectronHtmlTest from 'framework/modules/electron/interface/graphical/web/html/tests/ElectronHtmlTest.js';
import Assert from 'framework/system/test/Assert.js';

import HtmlDocument from 'framework/system/interface/graphical/web/html/HtmlDocument.js';
import Html from 'framework/system/interface/graphical/web/html/Html.js';
import InputComposeEvent from 'framework/system/interface/graphical/web/html/events/html-element/input/InputComposeEvent.js';

// Class
class InputComposeEventTest extends ElectronHtmlTest {

	async testInputComposeEvent() {
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
			console.info(event.identifier, event);
		});

		// Add an event listener to the textarea to capture the event when triggered
		textAreaElement.on('input.compose.*', function(event) {
			console.info(event.identifier, event);

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

        console.info('this', this);

        // Click into the text area
        await this.inputPressHtmlNode(textAreaElement);

        // Start composing
		// How to trigger a input.compose event? This doesn't do it
        await this.inputKeyPress('A');

		//Assert.true(Class.isInstance(capturedCompositionStartEvent, InputComposeEvent), '"input.compose.start" events are instances of InputComposeEvent');
		//Assert.true(Class.isInstance(capturedCompositionUpdateEvent, InputComposeEvent), '"input.compose.update" events are instances of InputComposeEvent');
		//Assert.true(Class.isInstance(capturedCompositionEndEvent, InputComposeEvent), '"input.compose.end" events are instances of InputComposeEvent');

		//throw new Error('Throwing error to display browser window.');
	}

}

// Export
export default InputComposeEventTest;
