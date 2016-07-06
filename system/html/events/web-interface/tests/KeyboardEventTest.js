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

		htmlElement.on('keyboard.*', function(event) {
		//htmlElement.on('keyboard.key.a.press', function(event) {
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

		//throw new Error('Throwing error to display browser window.');
	},

	testVariousKeyboardEvents: function*() {
		// Create an HtmlDocument
        var htmlDocument = new HtmlDocument();

        htmlDocument.body.setStyle('margin', 0);
        htmlDocument.body.setStyle('padding', '30px');

		// Create a textarea HtmlElement
		var htmlElement = Html.textarea();

		// Append the HtmlElement to the HtmlDocument body
		htmlDocument.body.append(htmlElement);

		// Set a variable to capture the event
		var capturedEventKeyboardKeyUpPress = null;
		var capturedEventKeyboardKeyUpPressCount = 0;
		var capturedEventKeyboardKeyDownPress = null;
		var capturedEventKeyboardKeyDownPressCount = 0;
		var capturedEventKeyboardKeyLeftPress = null;
		var capturedEventKeyboardKeyLeftPressCount = 0;
		var capturedEventKeyboardKeyRightPress = null;
		var capturedEventKeyboardKeyRightPressCount = 0;
		var capturedEventKeyboardKeyEnterPress = null;
		var capturedEventKeyboardKeyEnterPressCount = 0;
		var capturedEventKeyboardKeyBackspacePress = null;
		var capturedEventKeyboardKeyBackspacePressCount = 0;
		var capturedEventKeyboardKeySpacePress = null;
		var capturedEventKeyboardKeySpacePressCount = 0;
		var capturedEventKeyboardKeyAltPress = null;
		var capturedEventKeyboardKeyAltPressCount = 0;
		var capturedEventKeyboardKeyControlPress = null;
		var capturedEventKeyboardKeyControlPressCount = 0;
		var capturedEventKeyboardKeyMetaPress = null;
		var capturedEventKeyboardKeyMetaPressCount = 0;
		var capturedEventKeyboardKeyShiftPress = null;
		var capturedEventKeyboardKeyShiftPressCount = 0;
		var capturedEventKeyboardKeyDeletePress = null;
		var capturedEventKeyboardKeyDeletePressCount = 0;
		var capturedEventKeyboardKeyInsertPress = null;
		var capturedEventKeyboardKeyInsertPressCount = 0;

		//htmlElement.on('keyboard.*', function(event) {
		htmlElement.on('keyboard.key.up.press', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedEventKeyboardKeyUpPress = event;
			capturedEventKeyboardKeyUpPressCount++;
		});
		htmlElement.on('keyboard.key.down.press', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedEventKeyboardKeyDownPress = event;
			capturedEventKeyboardKeyDownPressCount++;
		});
		htmlElement.on('keyboard.key.left.press', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedEventKeyboardKeyLeftPress = event;
			capturedEventKeyboardKeyLeftPressCount++;
		});
		htmlElement.on('keyboard.key.right.press', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedEventKeyboardKeyRightPress = event;
			capturedEventKeyboardKeyRightPressCount++;
		});
		htmlElement.on('keyboard.key.enter.press', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedEventKeyboardKeyEnterPress = event;
			capturedEventKeyboardKeyEnterPressCount++;
		});
		htmlElement.on('keyboard.key.backspace.press', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedEventKeyboardKeyBackspacePress = event;
			capturedEventKeyboardKeyBackspacePressCount++;
		});
		htmlElement.on('keyboard.key.space.press', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedEventKeyboardKeySpacePress = event;
			capturedEventKeyboardKeySpacePressCount++;
		});
		htmlElement.on('keyboard.key.alt.press', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedEventKeyboardKeyAltPress = event;
			capturedEventKeyboardKeyAltPressCount++;
		});
		htmlElement.on('keyboard.key.control.press', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedEventKeyboardKeyControlPress = event;
			capturedEventKeyboardKeyControlPressCount++;
		});
		htmlElement.on('keyboard.key.meta.press', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedEventKeyboardKeyMetaPress = event;
			capturedEventKeyboardKeyMetaPressCount++;
		});
		htmlElement.on('keyboard.key.shift.press', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedEventKeyboardKeyShiftPress = event;
			capturedEventKeyboardKeyShiftPressCount++;
		});
		htmlElement.on('keyboard.key.delete.press', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedEventKeyboardKeyDeletePress = event;
			capturedEventKeyboardKeyDeletePressCount++;
		});
		htmlElement.on('keyboard.key.insert.press', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedEventKeyboardKeyInsertPress = event;
			capturedEventKeyboardKeyInsertPressCount++;
		});

		// Mount the HtmlDocument to the DOM
        htmlDocument.mountToDom();

        // Click into the text area
		yield ElectronManager.clickHtmlElement(htmlElement);

		yield ElectronManager.keyDown('Up');
		yield ElectronManager.keyUp('Up');
		Assert.true(Class.isInstance(capturedEventKeyboardKeyUpPress, KeyboardEvent), '"keyboard.key.up.press" events are instances of KeyboardEvent');

		yield ElectronManager.keyPress('Down');
		Assert.true(Class.isInstance(capturedEventKeyboardKeyDownPress, KeyboardEvent), '"keyboard.key.down.press" events are instances of KeyboardEvent');

		yield ElectronManager.keyPress('Left');
		Assert.true(Class.isInstance(capturedEventKeyboardKeyLeftPress, KeyboardEvent), '"keyboard.key.left.press" events are instances of KeyboardEvent');

		yield ElectronManager.keyPress('Right');
		Assert.true(Class.isInstance(capturedEventKeyboardKeyRightPress, KeyboardEvent), '"keyboard.key.right.press" events are instances of KeyboardEvent');

		yield ElectronManager.keyPress('Enter');
		Assert.true(Class.isInstance(capturedEventKeyboardKeyEnterPress, KeyboardEvent), '"keyboard.key.enter.press" events are instances of KeyboardEvent');

		yield ElectronManager.keyDown('Backspace');
		yield ElectronManager.keyUp('Backspace');
		Assert.true(Class.isInstance(capturedEventKeyboardKeyBackspacePress, KeyboardEvent), '"keyboard.key.backspace.press" events are instances of KeyboardEvent');

		yield ElectronManager.keyPress('Space');
		Assert.true(Class.isInstance(capturedEventKeyboardKeySpacePress, KeyboardEvent), '"keyboard.key.space.press" events are instances of KeyboardEvent');

		yield ElectronManager.keyPress('Alt');
		Assert.true(Class.isInstance(capturedEventKeyboardKeyAltPress, KeyboardEvent), '"keyboard.key.alt.press" events are instances of KeyboardEvent');

		yield ElectronManager.keyPress('Control');
		Assert.true(Class.isInstance(capturedEventKeyboardKeyControlPress, KeyboardEvent), '"keyboard.key.control.press" events are instances of KeyboardEvent');

		yield ElectronManager.keyPress('Meta');
		Assert.true(Class.isInstance(capturedEventKeyboardKeyMetaPress, KeyboardEvent), '"keyboard.key.meta.press" events are instances of KeyboardEvent');

		yield ElectronManager.keyPress('Shift');
		Assert.true(Class.isInstance(capturedEventKeyboardKeyShiftPress, KeyboardEvent), '"keyboard.key.shift.press" events are instances of KeyboardEvent');

		yield ElectronManager.keyPress('Delete');
		Assert.true(Class.isInstance(capturedEventKeyboardKeyDeletePress, KeyboardEvent), '"keyboard.key.delete.press" events are instances of KeyboardEvent');

		yield ElectronManager.keyPress('Insert');
		Assert.true(Class.isInstance(capturedEventKeyboardKeyInsertPress, KeyboardEvent), '"keyboard.key.insert.press" events are instances of KeyboardEvent');

		// Check counts
		Assert.strictEqual(capturedEventKeyboardKeyUpPressCount, 1, '"keyboard.key.up.press" events are emitted the correct number of times');
		Assert.strictEqual(capturedEventKeyboardKeyDownPressCount, 1, '"keyboard.key.down.press" events are emitted the correct number of times');
		Assert.strictEqual(capturedEventKeyboardKeyLeftPressCount, 1, '"keyboard.key.left.press" events are emitted the correct number of times');
		Assert.strictEqual(capturedEventKeyboardKeyRightPressCount, 1, '"keyboard.key.right.press" events are emitted the correct number of times');
		Assert.strictEqual(capturedEventKeyboardKeyEnterPressCount, 1, '"keyboard.key.enter.press" events are emitted the correct number of times');
		Assert.strictEqual(capturedEventKeyboardKeyBackspacePressCount, 1, '"keyboard.key.backspace.press" events are emitted the correct number of times');
		Assert.strictEqual(capturedEventKeyboardKeySpacePressCount, 1, '"keyboard.key.space.press" events are emitted the correct number of times');
		Assert.strictEqual(capturedEventKeyboardKeyAltPressCount, 1, '"keyboard.key.alt.press" events are emitted the correct number of times');
		Assert.strictEqual(capturedEventKeyboardKeyControlPressCount, 1, '"keyboard.key.control.press" events are emitted the correct number of times');
		Assert.strictEqual(capturedEventKeyboardKeyMetaPressCount, 1, '"keyboard.key.meta.press" events are emitted the correct number of times');
		Assert.strictEqual(capturedEventKeyboardKeyShiftPressCount, 1, '"keyboard.key.shift.press" events are emitted the correct number of times');
		Assert.strictEqual(capturedEventKeyboardKeyDeletePressCount, 1, '"keyboard.key.delete.press" events are emitted the correct number of times');
		Assert.strictEqual(capturedEventKeyboardKeyInsertPressCount, 1, '"keyboard.key.insert.press" events are emitted the correct number of times');

		//throw new Error('Throwing error to display browser window.');
	},

});

// Export
module.exports = KeyboardEventTest;