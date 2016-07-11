// Dependencies
var ElectronTest = Framework.require('system/electron/tests/ElectronTest.js');
var Assert = Framework.require('system/test/Assert.js');
var HtmlDocument = Framework.require('system/html/HtmlDocument.js');
var Html = Framework.require('system/html/Html.js');
var ElectronManager = null;
var InputKeyEvent = Framework.require('system/html/events/html-element/input/InputKeyEvent.js');

// Class
var InputKeyEventTest = ElectronTest.extend({

	before: function*() {
		// Initialize the ElectronManager here as to not throw an exception when electron is not present
		ElectronManager = Framework.require('system/electron/ElectronManager.js');
	},

	testAllInputKeyEvents: function*() {
		// Create an HtmlDocument
        var htmlDocument = new HtmlDocument();

		// Create a textarea HtmlElement
		var htmlElement = Html.textarea();

		htmlElement.on('input.key.*', function(event) {
			//Console.standardInfo(event.identifier, event);
		});

		// Append the HtmlElement to the HtmlDocument body
		htmlDocument.body.append(htmlElement);

		// Mount the HtmlDocument to the DOM
        htmlDocument.mountToDom();

        throw new Error('Throwing error to display browser window.');
	},

	testInputKeyEvent: function*() {
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

		//htmlElement.on('input.key.*', function(event) {
		htmlElement.on('input.key.A', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedEvent = event;
		});

		// Mount the HtmlDocument to the DOM
        htmlDocument.mountToDom();

        // Click into the text area
		yield ElectronManager.clickHtmlElement(htmlElement);

		// Type a key
		yield ElectronManager.pressKey('A');
		Assert.true(Class.isInstance(capturedEvent, InputKeyEvent), '"input.key.A" events triggered by key presses are instances of InputKeyEvent');

		Assert.strictEqual(capturedEvent.modifierKeysDown.alt, false, 'modifierKeysDown.alt property is correctly set');
		Assert.strictEqual(capturedEvent.modifierKeysDown.command, false, 'modifierKeysDown.command property is correctly set');
		Assert.strictEqual(capturedEvent.modifierKeysDown.control, false, 'modifierKeysDown.control property is correctly set');
		Assert.strictEqual(capturedEvent.modifierKeysDown.shift, false, 'modifierKeysDown.shift property is correctly set');
		Assert.strictEqual(capturedEvent.modifierKeysDown.windows, false, 'modifierKeysDown.windows property is correctly set');

		Assert.strictEqual(capturedEvent.key, 'A', 'key property is correctly set');

		Assert.strictEqual(capturedEvent.keyLocation, 'standard', 'keyLocation property is correctly set');

		Assert.strictEqual(capturedEvent.keyHeldDown, false, 'keyHeldDown property is correctly set');

		Assert.strictEqual(capturedEvent.trusted, true, 'trusted property is correctly set');

		//throw new Error('Throwing error to display browser window.');
	},

	testVariousInputKeyEvents: function*() {
		// Create an HtmlDocument
        var htmlDocument = new HtmlDocument();

        htmlDocument.body.setStyle('margin', 0);
        htmlDocument.body.setStyle('padding', '30px');

		// Create a textarea HtmlElement
		var htmlElement = Html.textarea();

		// Append the HtmlElement to the HtmlDocument body
		htmlDocument.body.append(htmlElement);

		// Set a variable to capture the event
		var capturedEventKeyboardKeyUp = null;
		var capturedEventKeyboardKeyUpCount = 0;
		var capturedEventKeyboardKeyDown = null;
		var capturedEventKeyboardKeyDownCount = 0;
		var capturedEventKeyboardKeyLeft = null;
		var capturedEventKeyboardKeyLeftCount = 0;
		var capturedEventKeyboardKeyRight = null;
		var capturedEventKeyboardKeyRightCount = 0;
		var capturedEventKeyboardKeyEnter = null;
		var capturedEventKeyboardKeyEnterCount = 0;
		var capturedEventKeyboardKeyBackspace = null;
		var capturedEventKeyboardKeyBackspaceCount = 0;
		var capturedEventKeyboardKeySpace = null;
		var capturedEventKeyboardKeySpaceCount = 0;
		var capturedEventKeyboardKeyAlt = null;
		var capturedEventKeyboardKeyAltCount = 0;
		var capturedEventKeyboardKeyControl = null;
		var capturedEventKeyboardKeyControlCount = 0;
		var capturedEventKeyboardKeyMeta = null;
		var capturedEventKeyboardKeyMetaCount = 0;
		var capturedEventKeyboardKeyShift = null;
		var capturedEventKeyboardKeyShiftCount = 0;
		var capturedEventKeyboardKeyDelete = null;
		var capturedEventKeyboardKeyDeleteCount = 0;
		var capturedEventKeyboardKeyInsert = null;
		var capturedEventKeyboardKeyInsertCount = 0;

		//htmlElement.on('input.*', function(event) {
		//htmlElement.on('input.key.*', function(event) {
		htmlElement.on('input.key.up', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedEventKeyboardKeyUp = event;
			capturedEventKeyboardKeyUpCount++;
		});
		htmlElement.on('input.key.down', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedEventKeyboardKeyDown = event;
			capturedEventKeyboardKeyDownCount++;
		});
		htmlElement.on('input.key.left', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedEventKeyboardKeyLeft = event;
			capturedEventKeyboardKeyLeftCount++;
		});
		htmlElement.on('input.key.right', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedEventKeyboardKeyRight = event;
			capturedEventKeyboardKeyRightCount++;
		});
		htmlElement.on('input.key.enter', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedEventKeyboardKeyEnter = event;
			capturedEventKeyboardKeyEnterCount++;
		});
		htmlElement.on('input.key.backspace', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedEventKeyboardKeyBackspace = event;
			capturedEventKeyboardKeyBackspaceCount++;
		});
		htmlElement.on('input.key.space', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedEventKeyboardKeySpace = event;
			capturedEventKeyboardKeySpaceCount++;
		});
		htmlElement.on('input.key.alt', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedEventKeyboardKeyAlt = event;
			capturedEventKeyboardKeyAltCount++;
		});
		htmlElement.on('input.key.control', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedEventKeyboardKeyControl = event;
			capturedEventKeyboardKeyControlCount++;
		});
		htmlElement.on('input.key.(command|windows)', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedEventKeyboardKeyMeta = event;
			capturedEventKeyboardKeyMetaCount++;
		});
		htmlElement.on('input.key.shift', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedEventKeyboardKeyShift = event;
			capturedEventKeyboardKeyShiftCount++;
		});
		htmlElement.on('input.key.delete', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedEventKeyboardKeyDelete = event;
			capturedEventKeyboardKeyDeleteCount++;
		});
		htmlElement.on('input.key.insert', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedEventKeyboardKeyInsert = event;
			capturedEventKeyboardKeyInsertCount++;
		});

		// Mount the HtmlDocument to the DOM
        htmlDocument.mountToDom();

        // Click into the text area
		yield ElectronManager.clickHtmlElement(htmlElement);

		yield ElectronManager.keyDown('Up');
		yield ElectronManager.keyUp('Up');
		Assert.true(Class.isInstance(capturedEventKeyboardKeyUp, InputKeyEvent), '"input.key.up" events are instances of InputKeyEvent');

		yield ElectronManager.keyPress('Down');
		Assert.true(Class.isInstance(capturedEventKeyboardKeyDown, InputKeyEvent), '"input.key.down" events are instances of InputKeyEvent');

		yield ElectronManager.keyPress('Left');
		Assert.true(Class.isInstance(capturedEventKeyboardKeyLeft, InputKeyEvent), '"input.key.left" events are instances of InputKeyEvent');

		yield ElectronManager.keyPress('Right');
		Assert.true(Class.isInstance(capturedEventKeyboardKeyRight, InputKeyEvent), '"input.key.right" events are instances of InputKeyEvent');

		yield ElectronManager.keyPress('Enter');
		Assert.true(Class.isInstance(capturedEventKeyboardKeyEnter, InputKeyEvent), '"input.key.enter" events are instances of InputKeyEvent');

		yield ElectronManager.keyDown('Backspace');
		yield ElectronManager.keyUp('Backspace');
		Assert.true(Class.isInstance(capturedEventKeyboardKeyBackspace, InputKeyEvent), '"input.key.backspace" events are instances of InputKeyEvent');

		yield ElectronManager.keyPress('Space');
		Assert.true(Class.isInstance(capturedEventKeyboardKeySpace, InputKeyEvent), '"input.key.space" events are instances of InputKeyEvent');

		yield ElectronManager.keyPress('Alt');
		Assert.true(Class.isInstance(capturedEventKeyboardKeyAlt, InputKeyEvent), '"input.key.alt" events are instances of InputKeyEvent');

		yield ElectronManager.keyPress('Control');
		Assert.true(Class.isInstance(capturedEventKeyboardKeyControl, InputKeyEvent), '"input.key.control" events are instances of InputKeyEvent');

		yield ElectronManager.keyPress('Meta');
		Assert.true(Class.isInstance(capturedEventKeyboardKeyMeta, InputKeyEvent), '"input.key.meta" events are instances of InputKeyEvent');

		yield ElectronManager.keyPress('Shift');
		Assert.true(Class.isInstance(capturedEventKeyboardKeyShift, InputKeyEvent), '"input.key.shift" events are instances of InputKeyEvent');

		yield ElectronManager.keyPress('Delete');
		Assert.true(Class.isInstance(capturedEventKeyboardKeyDelete, InputKeyEvent), '"input.key.delete" events are instances of InputKeyEvent');

		yield ElectronManager.keyPress('Insert');
		Assert.true(Class.isInstance(capturedEventKeyboardKeyInsert, InputKeyEvent), '"input.key.insert" events are instances of InputKeyEvent');

		// Check counts
		Assert.strictEqual(capturedEventKeyboardKeyUpCount, 1, '"input.key.up" events are emitted the correct number of times');
		Assert.strictEqual(capturedEventKeyboardKeyDownCount, 1, '"input.key.down" events are emitted the correct number of times');
		Assert.strictEqual(capturedEventKeyboardKeyLeftCount, 1, '"input.key.left" events are emitted the correct number of times');
		Assert.strictEqual(capturedEventKeyboardKeyRightCount, 1, '"input.key.right" events are emitted the correct number of times');
		Assert.strictEqual(capturedEventKeyboardKeyEnterCount, 1, '"input.key.enter" events are emitted the correct number of times');
		Assert.strictEqual(capturedEventKeyboardKeyBackspaceCount, 1, '"input.key.backspace" events are emitted the correct number of times');
		Assert.strictEqual(capturedEventKeyboardKeySpaceCount, 1, '"input.key.space" events are emitted the correct number of times');
		Assert.strictEqual(capturedEventKeyboardKeyAltCount, 1, '"input.key.alt" events are emitted the correct number of times');
		Assert.strictEqual(capturedEventKeyboardKeyControlCount, 1, '"input.key.control" events are emitted the correct number of times');
		Assert.strictEqual(capturedEventKeyboardKeyMetaCount, 1, '"input.key.meta" events are emitted the correct number of times');
		Assert.strictEqual(capturedEventKeyboardKeyShiftCount, 1, '"input.key.shift" events are emitted the correct number of times');
		Assert.strictEqual(capturedEventKeyboardKeyDeleteCount, 1, '"input.key.delete" events are emitted the correct number of times');
		Assert.strictEqual(capturedEventKeyboardKeyInsertCount, 1, '"input.key.insert" events are emitted the correct number of times');

		//throw new Error('Throwing error to display browser window.');
	},

});

// Export
module.exports = InputKeyEventTest;