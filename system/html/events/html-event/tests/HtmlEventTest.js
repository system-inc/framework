// Dependencies
var ElectronTest = Framework.require('system/electron/tests/ElectronTest.js');
var Assert = Framework.require('system/test/Assert.js');
var HtmlDocument = Framework.require('system/html/HtmlDocument.js');
var Html = Framework.require('system/html/Html.js');
var ElectronManager = null;
var HtmlEvent = Framework.require('system/html/events/html-event/HtmlEvent.js');

// Class
var HtmlEventTest = ElectronTest.extend({

	before: function*() {
		// Initialize the ElectronManager here as to not throw an exception when electron is not present
		ElectronManager = Framework.require('system/electron/ElectronManager.js');
	},

	testRemoveEventListeners: function*() {
		throw new Error('Throwing error to display browser window.');
	},

	testRemoveAllEventListeners: function*() {
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

		// Testing
		divElement.on('input.press', function(event) {
			Console.standardInfo(event.identifier, event);

			capturedEventCount++;
		});

		// Mount the HtmlDocument to the DOM
        htmlDocument.mountToDom();

        // Click
        yield ElectronManager.clickHtmlElement(divElement);

        Assert.strictEqual(capturedEventCount, 1, 'event fired as expected');

        // Remove event listeners
        divElement.removeAllEventListeners();

        // Make sure the element does not have any event listeners on the DOM object
        Console.standardWarn('divElement.eventListenersOnDomObject', divElement.eventListenersOnDomObject);
        Assert.false(divElement.eventListenersOnDomObject.contains('click'), 'the DOM event listeners have been removed');

        // Click again
        yield ElectronManager.clickHtmlElement(divElement);

        Assert.strictEqual(capturedEventCount, 1, 'events do not fire after the listeners are removed');

		throw new Error('Throwing error to display browser window.');
	},

});

// Export
module.exports = HtmlEventTest;