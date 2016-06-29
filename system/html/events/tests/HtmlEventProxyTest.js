// Dependencies
var Test = Framework.require('system/test/Test.js');
var Assert = Framework.require('system/test/Assert.js');
var EventEmitter = Framework.require('system/events/EventEmitter.js');
var HtmlDocument = Framework.require('system/html/HtmlDocument.js');
var Html = Framework.require('system/html/Html.js');
var ElectronTest = Framework.require('system/electron/tests/ElectronTest.js');
// Class
var HtmlEventProxyTest = ElectronTest.extend({

	testHtmlEventProxyEventClick: function*() {
		var Electron = Node.require('electron');
		
		// Create an HtmlDocument
        var htmlDocument = new HtmlDocument();

		// Create a div HtmlElement
		var htmlElement = Html.div('div');

		// Append the HtmlElement to the HtmlDocument body
		htmlDocument.body.append(htmlElement);

		var capturedEvent = null;

		// Add an event listener to the div and capture the event
		htmlElement.on('click', function(event) {
			Console.standardError('click', event);
			capturedEvent = event;
		});

		// Simulate a click
		//yield htmlElement.emit('click');

		// TODO: Put this into a helper function that receives an HtmlElement, ElectronManager.clickHtmlElement();
		var webContents = Electron.remote.getCurrentWindow().webContents;
		webContents.sendInputEvent({
			type: 'mouseDown',
			x: 10,
			y: 10,
			button:'left',
			clickCount: 1,
		});
		webContents.sendInputEvent({
			type: 'mouseUp',
			x: 10,
			y: 10,
			button:'left',
			clickCount: 1,
		});



		Assert.strictEqual(capturedEvent, null, '"click" events do not get bound');

		// Mount the HtmlDocument to the DOM
        htmlDocument.mountToDom();

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