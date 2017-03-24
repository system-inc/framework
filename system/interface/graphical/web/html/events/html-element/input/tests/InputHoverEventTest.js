// Dependencies
import ElectronHtmlTest from 'framework/modules/electron/interface/graphical/web/html/tests/ElectronHtmlTest.js';
import Assert from 'framework/system/test/Assert.js';

import HtmlDocument from 'framework/system/interface/graphical/web/html/HtmlDocument.js';
import Html from 'framework/system/interface/graphical/web/html/Html.js';
import InputHoverEvent from 'framework/system/interface/graphical/web/html/events/html-element/input/InputHoverEvent.js';

// Class
class InputHoverEventTest extends ElectronHtmlTest {

	async testInputHoverEvent() {
		// Create an HtmlDocument
        var htmlDocument = new HtmlDocument();

        htmlDocument.body.setStyle('margin', 0);
        htmlDocument.body.setStyle('padding', '30px');

		// Create a div HtmlElement
		var htmlElement = Html.div({
			content: 'div',
			style: 'background: #EFEFEF; padding: 30px;',
		});

		// Append the HtmlElement to the HtmlDocument body
		htmlDocument.body.append(htmlElement);

		// Set a variable to capture the event
		var capturedEventInputHover = null;
		var capturedEventInputHoverIn = null;
		var capturedEventInputHoverOut = null;
		var capturedEventInputHoverInExact = null;
		var capturedEventInputHoverOutExact = null;

		// Add an event listener to the div to capture the event when triggered
		htmlElement.on('input.hover.*', function(event) {
			console.info(event.identifier, event);

			if(event.identifier == 'input.hover') {
				capturedEventInputHover = event;
			}
			else if(event.identifier == 'input.hover.in') {
				capturedEventInputHoverIn = event;
			}
			else if(event.identifier == 'input.hover.out') {
				capturedEventInputHoverOut = event;
			}
			else if(event.identifier == 'input.hover.in.exact') {
				capturedEventInputHoverInExact = event;
			}
			else if(event.identifier == 'input.hover.out.exact') {
				capturedEventInputHoverOutExact = event;
			}
		});

		// Mount the HtmlDocument to the DOM
        htmlDocument.mountToDom();

        // Simulate moving the mouse over
        await this.inputHoverHtmlNode(htmlElement);

        // Simulate moving the mouse out
        await this.inputHoverHtmlNode(htmlDocument.body);
        
		Assert.true(capturedEventInputHover, '"input.hover" events are emitted');
		Assert.true(capturedEventInputHoverIn, '"input.hover.in" events are emitted');
		Assert.true(capturedEventInputHoverOut, '"input.hover.out" events are emitted');
		Assert.true(capturedEventInputHoverInExact, '"input.hover.in.exact" events are emitted');
		Assert.true(capturedEventInputHoverOutExact, '"input.hover.out.exact" events are emitted');
	
        //throw new Error('Throwing error to display browser window.');
	}

}

// Export
export default InputHoverEventTest;
