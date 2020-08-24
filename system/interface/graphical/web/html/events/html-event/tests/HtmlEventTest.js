// Dependencies
import { ElectronHtmlTest } from '@framework/modules/electron/interface/graphical/web/html/tests/ElectronHtmlTest.js';
import { Assert } from '@framework/system/test/Assert.js';

import { HtmlDocument } from '@framework/system/interface/graphical/web/html/HtmlDocument.js';
import { Html } from '@framework/system/interface/graphical/web/html/Html.js';
import { HtmlEvent } from '@framework/system/interface/graphical/web/html/events/html-event/HtmlEvent.js';

// Class
class HtmlEventTest extends ElectronHtmlTest {

	async testRemoveEventListener() {
        // Create an HtmlDocument
        var htmlDocument = new HtmlDocument();

		// Create a text area with some text        
        var divElement = Html.div();
        divElement.setStyle({
        	width: '320px',
        	height: '240px',
        	background: '#00AAFF',
        });

        // Append the form to the HtmlDocument body
        htmlDocument.body.append(divElement);

        var capturedEventCount = 0;

        // Add one event listener
        var boundFunction1 = function(event) {
        	console.info(event.identifier, event);
        	capturedEventCount++;
        };
        divElement.on('input.press', boundFunction1);

        // Add a second event listener
        var boundFunction2 = function(event) {
        	console.info(event.identifier, event);
        	capturedEventCount++;
        };
        divElement.on('input.press', boundFunction2);

        // Mount the HtmlDocument to the DOM
        htmlDocument.mountToDom();

        // There should be two event listeners bound to click
        Assert.strictEqual(divElement.eventListenersOnDomObject['click'].count, 2, 'the DOM event listeners have been added');

        // Click
        await this.inputPressHtmlNode(divElement);

        Assert.strictEqual(capturedEventCount, 2, 'events emitted as expected');

        // Remove the first event listener
        divElement.removeEventListener('input.press', boundFunction1);

        // There should be one event listener bound to click
        Assert.strictEqual(divElement.eventListenersOnDomObject['click'].count, 1, 'a DOM event listener has been removed');

        // Click again
        await this.inputPressHtmlNode(divElement);

        // The count should go up by 1
        Assert.strictEqual(capturedEventCount, 3, 'events do not emit after listener removed');

        // Remove the second event listener
        divElement.removeEventListener('input.press', boundFunction2);

        // Click again
        await this.inputPressHtmlNode(divElement);

        // The count should not change
        Assert.strictEqual(capturedEventCount, 3, 'events do not emit after listener removed');

        // Make sure the element does not have any event listeners on the DOM object
        console.warn('divElement.eventListenersOnDomObject', divElement.eventListenersOnDomObject);
        Assert.strictEqual(divElement.eventListenersOnDomObject['click'], undefined, 'the DOM event listeners have been removed');

        // Call this function one more time just to try and break things
        divElement.removeEventListener('input.press', boundFunction2);

		//throw new Error('Throwing error to display browser window.');
	}

	async testRemoveEventListenerByEventPatternOnly() {
		// Create an HtmlDocument
        var htmlDocument = new HtmlDocument();

		// Create a text area with some text        
        var divElement = Html.div();
        divElement.setStyle({
        	width: '320px',
        	height: '240px',
        	background: '#00AAFF',
        });

		// Append the form to the HtmlDocument body
		htmlDocument.body.append(divElement);

		var capturedEventCount = 0;

		// Add one event listener
		divElement.on('input.press', function(event) {
			console.info(event.identifier, event);
			capturedEventCount++;
		});

		// Add a second event listener
		divElement.on('input.press', function(event) {
			console.info(event.identifier, event);
			capturedEventCount++;
		});

		// Add one more event listener that also binds to click but that is different
		divElement.on('input.press.tertiary', function(event) {
			console.info(event.identifier, event);
			capturedEventCount++;
		});		

		// Mount the HtmlDocument to the DOM
        htmlDocument.mountToDom();

        // There should be three event listeners bound to click
        Assert.strictEqual(divElement.eventListenersOnDomObject['click'].count, 3, 'the DOM event listeners have been added');

        // Click
        await this.inputPressHtmlNode(divElement);

        Assert.strictEqual(capturedEventCount, 2, '"input.press" events emitted as expected');

        // Remove all input.press event listeners
        divElement.removeEventListener('input.press');

        console.warn('divElement.eventListenersOnDomObject', divElement.eventListenersOnDomObject);
        Assert.strictEqual(divElement.eventListenersOnDomObject['click'].count, 1, 'the DOM event listeners have been removed');

        // Call this function one more time just to try and break things
        divElement.removeEventListener('input.press');

        // Click again
        await this.inputPressHtmlNode(divElement);

        // The count should not change
        Assert.strictEqual(capturedEventCount, 2, 'events do not emit after listener removed');

        // Remove the other event
        divElement.removeEventListener('input.press.tertiary');

        // Make sure the element does not have any event listeners on the DOM object
        console.warn('divElement.eventListenersOnDomObject', divElement.eventListenersOnDomObject);
        Assert.strictEqual(divElement.eventListenersOnDomObject['click'], undefined, 'the DOM event listeners have been removed');

		//throw new Error('Throwing error to display browser window.');
	}

	async testRemoveAllEventListeners() {
		// Create an HtmlDocument
        var htmlDocument = new HtmlDocument();

		// Create a text area with some text        
        var divElement = Html.div();
        divElement.setStyle({
        	width: '320px',
        	height: '240px',
        	background: '#00AAFF',
        });

		// Append the form to the HtmlDocument body
		htmlDocument.body.append(divElement);

		var capturedEventCount = 0;

		// Add one event listener
		divElement.on('input.press', function(event) {
			console.info(event.identifier, event);
			capturedEventCount++;
		});

		// Add a second event listener
		divElement.on('input.press', function(event) {
			console.info(event.identifier, event);
			capturedEventCount++;
		});

		// Mount the HtmlDocument to the DOM
        htmlDocument.mountToDom();

        // Click
        await this.inputPressHtmlNode(divElement);

        Assert.strictEqual(capturedEventCount, 2, 'events emitted as expected');

        // Remove event listeners
        divElement.removeAllEventListeners();

        // Make sure the element does not have any event listeners on the DOM object
        console.warn('divElement.eventListenersOnDomObject', divElement.eventListenersOnDomObject);
        Assert.strictEqual(divElement.eventListenersOnDomObject['click'], undefined, 'the DOM event listeners have been removed');

        // Click again
        await this.inputPressHtmlNode(divElement);

        Assert.strictEqual(capturedEventCount, 2, 'events do not emit after the listeners are removed');

		//throw new Error('Throwing error to display browser window.');
	}

}

// Export
export { HtmlEventTest };
