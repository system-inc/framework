// Dependencies
import ElectronTest from 'system/electron/tests/ElectronTest.js';
import Assert from 'system/test/Assert.js';
import HtmlDocument from 'system/interface/graphical/web/html/HtmlDocument.js';
import Html from 'system/interface/graphical/web/html/Html.js';
import HtmlEvent from 'system/interface/graphical/web/html/events/html-event/HtmlEvent.js';
import HtmlNodeEvent from 'system/interface/graphical/web/html/events/html-node/HtmlNodeEvent.js';
import HtmlElementEvent from 'system/interface/graphical/web/html/events/html-element/HtmlElementEvent.js';
import InputPressEvent from 'system/interface/graphical/web/html/events/html-element/input/InputPressEvent.js';
import InputScrollEvent from 'system/interface/graphical/web/html/events/html-element/input/InputScrollEvent.js';
var ElectronManager = null;

// Class
class InputScrollEventTest extends ElectronTest {

	async before() {
		// Initialize the ElectronManager here as to not throw an exception when electron is not present
		ElectronManager = Framework.require('system/electron/ElectronManager.js');
	}

	async testInputScrollEvent() {
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
		var capturedEventInputScroll = null;
		var capturedEventInputScrollUp = null;
		var capturedEventInputScrollDown = null;
		var capturedEventInputScrollLeft = null;
		var capturedEventInputScrollRight = null;

		// Add an event listener to the div to capture the event when triggered
		htmlElement.on('input.scroll.*', function(event) {
			Console.standardInfo(event.identifier, event);

			if(event.identifier == 'input.scroll') {
				capturedEventInputScroll = event;
			}
			else if(event.identifier == 'input.scroll.up') {
				capturedEventInputScrollUp = event;
			}
			else if(event.identifier == 'input.scroll.down') {
				capturedEventInputScrollDown = event;
			}
			else if(event.identifier == 'input.scroll.left') {
				capturedEventInputScrollLeft = event;
			}
			else if(event.identifier == 'input.scroll.right') {
				capturedEventInputScrollRight = event;
			}
		});

		// Mount the HtmlDocument to the DOM
        htmlDocument.mountToDom();

        // TODO: ElectronManager.wheelRotateHtmlElement does not work on Windows, so none of these events pass
        return;

        // Simulate a wheel scroll up
		// htmlElement, deltaX, deltaY, wheelTicksX, wheelTicksY, accelerationRatioX, accelerationRatioY, hasPreciseScrollingDeltas, canScroll, modifiers
		await ElectronManager.wheelRotateHtmlElement(htmlElement, 0, 1, 0, 1, 1, 1, true, true);

		Assert.true(capturedEventInputScroll, '"input.scroll" events are emitted');
		Assert.true(capturedEventInputScrollUp, '"input.scroll.up" events are emitted');

		// Simulate a wheel scroll down
		// htmlElement, deltaX, deltaY, wheelTicksX, wheelTicksY, accelerationRatioX, accelerationRatioY, hasPreciseScrollingDeltas, canScroll, modifiers
		await ElectronManager.wheelRotateHtmlElement(htmlElement, 0, -1, 0, -1, 1, 1, true, true);
		Assert.true(capturedEventInputScrollDown, '"input.scroll.down" events are emitted');

		// Simulate a wheel scroll left
		// htmlElement, deltaX, deltaY, wheelTicksX, wheelTicksY, accelerationRatioX, accelerationRatioY, hasPreciseScrollingDeltas, canScroll, modifiers
		await ElectronManager.wheelRotateHtmlElement(htmlElement, 1, 0, 1, 0, 1, 1, true, true);
		Assert.true(capturedEventInputScrollLeft, '"input.scroll.left" events are emitted');

		// Simulate a wheel scroll right
		// htmlElement, deltaX, deltaY, wheelTicksX, wheelTicksY, accelerationRatioX, accelerationRatioY, hasPreciseScrollingDeltas, canScroll, modifiers
		await ElectronManager.wheelRotateHtmlElement(htmlElement, -1, 0, -1, 0, 1, 1, true, true);
		Assert.true(capturedEventInputScrollRight, '"input.scroll.right" events are emitted');
	
        //throw new Error('Throwing error to display browser window.');
	}

}

// Export
export default InputScrollEventTest;