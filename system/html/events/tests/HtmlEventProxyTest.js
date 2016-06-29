// Dependencies
var ElectronTest = Framework.require('system/electron/tests/ElectronTest.js');
var Assert = Framework.require('system/test/Assert.js');
var HtmlDocument = Framework.require('system/html/HtmlDocument.js');
var Html = Framework.require('system/html/Html.js');
var ElectronManager = Framework.require('system/electron/ElectronManager.js');

// Class
var HtmlEventProxyTest = ElectronTest.extend({

	testHtmlEventProxyEventClick: function*() {
		// Create an HtmlDocument
        var htmlDocument = new HtmlDocument();

		// Create a div HtmlElement
		var htmlElement = Html.div('div');

		// Append the HtmlElement to the HtmlDocument body
		htmlDocument.body.append(htmlElement);

		var capturedEvent = null;

		// Add an event listener to the div and capture the event
		htmlElement.on('click', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedEvent = event;
		});

		// Mount the HtmlDocument to the DOM
        htmlDocument.mountToDom();

        // Simulate a click
        //yield ElectronManager.clickHtmlElement(htmlElement);
        htmlElement.click();

        Assert.strictEqual(capturedEvent, null, '"click" events do not get bound');

        //throw 123;
	},

	//keyboard.key.rightArrow.up

	//div.on('interact', function() {
	//	console.log('interact');
	//});

	//div.on('mouse.button.one.click', function() {
	//	console.log('mouse.button.one.click');
	//});

});

// Export
module.exports = HtmlEventProxyTest;