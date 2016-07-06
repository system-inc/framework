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

	// This generates untrusted events which do nothing, they aren't even of type KeyboardEvent
	//this.domNodeEmitKeyPressEvent(htmlElement.domNode, 'A');
	//domNodeEmitKeyPressEvent: function(domNode, key) {
	//	var event = document.createEvent('Events');
	//	event.initEvent('keypress', true, true);
	//	event.keyCode = event.which = key.charCodeAt(0);
	//	domNode.dispatchEvent(event);
	//},

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

		//htmlElement.on('keyboard.*', function(event) {
		htmlElement.on('keyboard.key.right.press', function(event) {
		//htmlElement.on('keyboard.key.A.press', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedEvent = event;
		});

		// Mount the HtmlDocument to the DOM
        htmlDocument.mountToDom();

        // Click into the text area
		yield ElectronManager.clickHtmlElement(htmlElement);

		// Type a key
		yield ElectronManager.pressKey('A');

		Assert.true(Class.isInstance(capturedEvent, KeyboardEvent), '"keyboard.key.A.press" events triggered by key presses are instances of KeyboardEvent');

		Assert.strictEqual(capturedEvent.modifierKeysDown.alt, false, 'modifierKeysDown.alt property is correctly set');
		Assert.strictEqual(capturedEvent.modifierKeysDown.control, false, 'modifierKeysDown.control property is correctly set');
		Assert.strictEqual(capturedEvent.modifierKeysDown.meta, false, 'modifierKeysDown.meta property is correctly set');
		Assert.strictEqual(capturedEvent.modifierKeysDown.shift, false, 'modifierKeysDown.shift property is correctly set');

		Assert.strictEqual(capturedEvent.key, 'A', 'key property is correctly set');

		Assert.strictEqual(capturedEvent.keyLocation, 'standard', 'keyLocation property is correctly set');

		Assert.strictEqual(capturedEvent.keyHeldDown, false, 'keyHeldDown property is correctly set');

		Assert.strictEqual(capturedEvent.trusted, true, 'trusted property is correctly set');

		throw new Error('Throwing error to display browser window.');
	},

});

// Export
module.exports = KeyboardEventTest;