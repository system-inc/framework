// Dependencies
var ElectronTest = Framework.require('system/electron/tests/ElectronTest.js');
var Assert = Framework.require('system/test/Assert.js');
var HtmlDocument = Framework.require('system/html/HtmlDocument.js');
var Html = Framework.require('system/html/Html.js');

// Class
var HtmlEventProxyTest = ElectronTest.extend({

	testHtmlEventProxyEventClick: function*() {
		// Create an HtmlDocument
        var htmlDocument = new HtmlDocument();

		// Create a div HtmlElement
		var htmlElement = Html.div('div');

		// Append the HtmlElement to the HtmlDocument body
		htmlDocument.body.append(htmlElement);

		// Set a variable to capture the event
		var capturedEvent = null;

		// Add an event listener to the div to capture the event when triggered
		htmlElement.on('click', function(event) {
			//Console.standardInfo(event.identifier, event);
			capturedEvent = event;
		});

		// Mount the HtmlDocument to the DOM
        htmlDocument.mountToDom();

        // Simulate a click
        htmlElement.click();

        Assert.strictEqual(capturedEvent, null, '"click" events do not get bound');
	},

	testHtmlEventProxyEventInteract: function*() {
		// Create an HtmlDocument
        var htmlDocument = new HtmlDocument();

		// Create a div HtmlElement
		var htmlElement = Html.div('div');

		// Append the HtmlElement to the HtmlDocument body
		htmlDocument.body.append(htmlElement);

		// Set a variable to capture the event
		var capturedEvent = null;

		// Add an event listener to the div to capture the event when triggered
		htmlElement.on('interact', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedEvent = event;
		});

		// Mount the HtmlDocument to the DOM
        htmlDocument.mountToDom();

        // Simulate a click
        htmlElement.click();

        Assert.strictEqual(capturedEvent.identifier, 'interact', '"interact" events are triggered by clicks');
	},

});

// Export
module.exports = HtmlEventProxyTest;