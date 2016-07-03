// Dependencies
var ElectronTest = Framework.require('system/electron/tests/ElectronTest.js');
var Assert = Framework.require('system/test/Assert.js');
var HtmlDocument = Framework.require('system/html/HtmlDocument.js');
var Html = Framework.require('system/html/Html.js');
var ElectronManager = null;
var KeyboardEvent = Framework.require('system/html/events/web-interface/KeyboardEvent.js');

// Class
var KeyboardEventTest = ElectronTest.extend({

	before: function*() {
		// Initialize the ElectronManager here as to not throw an exception when electron is not present
		ElectronManager = Framework.require('system/electron/ElectronManager.js');
	},

	testKeyboardEvent: function*() {
		// Create an HtmlDocument
        var htmlDocument = new HtmlDocument();

        htmlDocument.body.setStyle('margin', 0);
        htmlDocument.body.setStyle('padding', '30px');

		// Create a textarea HtmlElement
		var htmlElement = Html.textarea();

		// Append the HtmlElement to the HtmlDocument body
		htmlDocument.body.append(htmlElement);

		// Set a variable to capture the event
		var capturedEvent = null;

		// Add an event listener to the textarea to capture the event when triggered
		htmlDocument.on('keyboard.key.*', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedEvent = event;
		});

		// Mount the HtmlDocument to the DOM
        htmlDocument.mountToDom();

        // Click into the text area
		yield ElectronManager.clickHtmlElement(htmlElement);

		// Type a key
		yield ElectronManager.pressKey('a');
		yield ElectronManager.pressKey('b');
		yield ElectronManager.pressKey('c');

		//Assert.true(Class.isInstance(capturedEvent, KeyboardEvent), '"interact" events triggered by clicks are instances of KeyboardEvent');

		//Assert.strictEqual(capturedEvent.type, 'click', 'type property is correctly set');

		//Assert.strictEqual(capturedEvent.keyboardKeysDown.alt, false, 'keyboardKeysDown.alt property is correctly set');
		//Assert.strictEqual(capturedEvent.keyboardKeysDown.ctrl, false, 'keyboardKeysDown.alt property is correctly set');
		//Assert.strictEqual(capturedEvent.keyboardKeysDown.meta, false, 'keyboardKeysDown.alt property is correctly set');
		//Assert.strictEqual(capturedEvent.keyboardKeysDown.shift, false, 'keyboardKeysDown.alt property is correctly set');

		//Assert.strictEqual(capturedEvent.mouseButtonsDown[1], false, 'mouseButtonsDown[1] property is correctly set');
		//Assert.strictEqual(capturedEvent.mouseButtonsDown[2], false, 'mouseButtonsDown[2] property is correctly set');
		//Assert.strictEqual(capturedEvent.mouseButtonsDown[3], false, 'mouseButtonsDown[3] property is correctly set');
		//Assert.strictEqual(capturedEvent.mouseButtonsDown[4], false, 'mouseButtonsDown[4] property is correctly set');
		//Assert.strictEqual(capturedEvent.mouseButtonsDown[5], false, 'mouseButtonsDown[5] property is correctly set');

		//Assert.strictEqual(capturedEvent.button, 1, 'button property is correctly set');

		//Assert.strictEqual(capturedEvent.offsets.emitter.x, 0, 'offsets.emitter.x property is correctly set');
		//Assert.strictEqual(capturedEvent.offsets.emitter.y, 0, 'offsets.emitter.y property is correctly set');
		//Assert.strictEqual(capturedEvent.offsets.relativeAncestor.x, 0, 'offsets.relativeAncestor.x property is correctly set');
		//Assert.strictEqual(capturedEvent.offsets.relativeAncestor.y, 0, 'offsets.relativeAncestor.y property is correctly set');
		//Assert.strictEqual(capturedEvent.offsets.viewport.x, 0, 'offsets.viewport.x property is correctly set');
		//Assert.strictEqual(capturedEvent.offsets.viewport.y, 0, 'offsets.viewport.y property is correctly set');
		//Assert.strictEqual(capturedEvent.offsets.document.x, 0, 'offsets.document.x property is correctly set');
		//Assert.strictEqual(capturedEvent.offsets.document.y, 0, 'offsets.document.y property is correctly set');
		//Assert.strictEqual(capturedEvent.offsets.global.x, 0, 'offsets.global.x property is correctly set');
		//Assert.strictEqual(capturedEvent.offsets.global.y, 0, 'offsets.global.y property is correctly set');
		//Assert.strictEqual(capturedEvent.offsets.previousGlobalOffset.x, 0, 'offsets.previousGlobalOffset.x property is correctly set');
		//Assert.strictEqual(capturedEvent.offsets.previousGlobalOffset.y, 0, 'offsets.previousGlobalOffset.y property is correctly set');

		//Assert.strictEqual(capturedEvent.relatedEmitter, null, 'relatedEmitter property is correctly set');
		//Assert.strictEqual(capturedEvent.relatedEmitterDomNode, null, 'relatedEmitterDomNode property is correctly set');

		//Assert.strictEqual(capturedEvent.clickCount, 0, 'clickCount property is correctly set');

		//Assert.strictEqual(capturedEvent.device.capabilities.touch, false, 'device.capabilities.touch property is correctly set');

		throw error;
	},

});

// Export
module.exports = KeyboardEventTest;

//keyboard.key.rightArrow.up