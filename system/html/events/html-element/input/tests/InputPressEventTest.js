// Dependencies
var ElectronTest = Framework.require('system/electron/tests/ElectronTest.js');
var Assert = Framework.require('system/test/Assert.js');
var HtmlDocument = Framework.require('system/html/HtmlDocument.js');
var Html = Framework.require('system/html/Html.js');
var ElectronManager = null;
var InputPressEvent = Framework.require('system/html/events/html-element/input/InputPressEvent.js');

// Class
var InputPressEventTest = ElectronTest.extend({

	before: function*() {
		// Initialize the ElectronManager here as to not throw an exception when electron is not present
		ElectronManager = Framework.require('system/electron/ElectronManager.js');
	},

	testClickEvent: function*() {
		// Create an HtmlDocument
        var htmlDocument = new HtmlDocument();

		// Create a div HtmlElement
		var htmlElement = Html.div('div');

		// Append the HtmlElement to the HtmlDocument body
		htmlDocument.body.append(htmlElement);

		// Set a variable to capture the event
		var capturedEvent = null;

		// Add an event listener to the div to capture the event when triggered
		try {
			htmlElement.on('click', function(event) {
				//Console.standardInfo(event.identifier, event);
				capturedEvent = event;
			});	
		}
		catch(error) {

		}		

		// Mount the HtmlDocument to the DOM
        htmlDocument.mountToDom();

        // Simulate a click
        yield ElectronManager.clickHtmlElement(htmlElement);

        Assert.strictEqual(capturedEvent, null, '"click" events do not get bound');

        //throw new Error('Throwing error to display browser window.');
	},

	testInputPressEvent: function*() {
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
		var capturedEvent = null;

		// Add an event listener to the div to capture the event when triggered
		//htmlElement.on('input.press.*', function(event) {
		htmlElement.on('input.press', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedEvent = event;
		});

		// Mount the HtmlDocument to the DOM
        htmlDocument.mountToDom();

        // Simulate a click
        yield ElectronManager.clickHtmlElement(htmlElement);

        Assert.true(Class.isInstance(capturedEvent, InputPressEvent), '"input.press" events are instances of HtmlEvent');
        Assert.true(Class.isInstance(capturedEvent, InputPressEvent), '"input.press" events are instances of InputPressEvent');

        Assert.strictEqual(capturedEvent.modifierKeysDown.alt, false, 'modifierKeysDown.alt property is correctly set');
        Assert.strictEqual(capturedEvent.modifierKeysDown.control, false, 'modifierKeysDown.control property is correctly set');
        Assert.strictEqual(capturedEvent.modifierKeysDown.meta, false, 'modifierKeysDown.meta property is correctly set');
        Assert.strictEqual(capturedEvent.modifierKeysDown.shift, false, 'modifierKeysDown.shift property is correctly set');
       
        Assert.strictEqual(capturedEvent.buttonsDown[1], false, 'buttonsDown[1] property is correctly set');
        Assert.strictEqual(capturedEvent.buttonsDown[2], false, 'buttonsDown[2] property is correctly set');
        Assert.strictEqual(capturedEvent.buttonsDown[3], false, 'buttonsDown[3] property is correctly set');
        Assert.strictEqual(capturedEvent.buttonsDown[4], false, 'buttonsDown[4] property is correctly set');
        Assert.strictEqual(capturedEvent.buttonsDown[5], false, 'buttonsDown[5] property is correctly set');

		Assert.strictEqual(capturedEvent.button, 1, 'button property is correctly set');

		Assert.strictEqual(capturedEvent.position.relativeToEmitter.x, 0, 'position.relativeToEmitter.x property is correctly set');
		Assert.strictEqual(capturedEvent.position.relativeToEmitter.y, 0, 'position.relativeToEmitter.y property is correctly set');
		Assert.strictEqual(capturedEvent.position.relativeToRelativeAncestor.x, 30, 'position.relativeToRelativeAncestor.x property is correctly set');
		Assert.strictEqual(capturedEvent.position.relativeToRelativeAncestor.y, 30, 'position.relativeToRelativeAncestor.y property is correctly set');
		Assert.strictEqual(capturedEvent.position.relativeToDocumentViewport.x, 30, 'position.relativeToDocumentViewport.x property is correctly set');
		Assert.strictEqual(capturedEvent.position.relativeToDocumentViewport.y, 30, 'position.relativeToDocumentViewport.y property is correctly set');
		Assert.strictEqual(capturedEvent.position.relativeToDocument.x, 30, 'position.relativeToDocument.x property is correctly set');
		Assert.strictEqual(capturedEvent.position.relativeToDocument.y, 30, 'position.relativeToDocument.y property is correctly set');

		// Cannot test these as the browser window is hidden
		//Assert.strictEqual(capturedEvent.position.relativeToGlobal.x, 0, 'position.relativeToGlobal.x property is correctly set');
		//Assert.strictEqual(capturedEvent.position.relativeToGlobal.y, 0, 'position.relativeToGlobal.y property is correctly set');
		//Assert.strictEqual(capturedEvent.position.relativeToPreviousGlobalRelativePosition.x, 0, 'position.relativeToPreviousGlobalRelativePosition.x property is correctly set');
		//Assert.strictEqual(capturedEvent.position.relativeToPreviousGlobalRelativePosition.y, 0, 'position.relativeToPreviousGlobalRelativePosition.y property is correctly set');

		Assert.strictEqual(capturedEvent.relatedEmitter, null, 'relatedEmitter property is correctly set');
		Assert.strictEqual(capturedEvent.relatedEmitterDomNode, null, 'relatedEmitterDomNode property is correctly set');

		Assert.strictEqual(capturedEvent.pressCount, 1, 'pressCount property is correctly set');

		Assert.strictEqual(capturedEvent.trusted, true, 'trusted property is correctly set');
	
        //throw new Error('Throwing error to display browser window.');
	},

	testInputPressEventInputPresses: function*() {
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
		var capturedPrimaryEvent = null;
		var capturedSecondaryEvent = null;
		var capturedTertiaryEvent = null;
		var capturedQuarternaryEvent = null;
		var capturedQuinaryEvent = null;

		// Add an event listener to the div to capture the event when triggered
		//htmlElement.on('input.press.*', function(event) {
		// Should never trigger since it should just be input.press
		htmlElement.on('input.press.primary', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedPrimaryEvent = event;
		});

		htmlElement.on('input.press.secondary', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedSecondaryEvent = event;
		});

		htmlElement.on('input.press.tertiary', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedTertiaryEvent = event;
		});

		htmlElement.on('input.press.quarternary', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedQuarternaryEvent = event;
		});

		htmlElement.on('input.press.quinary', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedQuinaryEvent = event;
		});

		// Mount the HtmlDocument to the DOM
        htmlDocument.mountToDom();
        
		// Simulate a primary press
        yield ElectronManager.clickHtmlElement(htmlElement);
        Assert.strictEqual(capturedPrimaryEvent, null, '"input.press.primary" events are not emitted, just use "input.press"');

        // Simulate a secondary press
        yield ElectronManager.clickHtmlElement(htmlElement, 'right');
        Assert.true(Class.isInstance(capturedSecondaryEvent, InputPressEvent), '"input.press.secondary" events are instances of InputPressEvent');

        // Simulate a tertiary press
        yield ElectronManager.clickHtmlElement(htmlElement, 'middle');
        Assert.true(Class.isInstance(capturedTertiaryEvent, InputPressEvent), '"input.press.tertiary" events are instances of InputPressEvent');

        // No way to simulate button 4 and button 5 clicks
        //Assert.true(Class.isInstance(capturedQuarternaryEvent, InputPressEvent), '"input.press.quarternary" events are instances of InputPressEvent');
        //Assert.true(Class.isInstance(capturedQuinaryEvent, InputPressEvent), '"input.press.quinary" events are instances of InputPressEvent');

        //throw new Error('Throwing error to display browser window.');
	},

	testInputPressEventInputPressDouble: function*() {
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
		var capturedEvent = null;

		// Add an event listener to the div to capture the event when triggered
		//htmlElement.on('*', function(event) {
		htmlElement.on('input.press.double', function(event) {
			Console.standardWarn(event.identifier, event);
			capturedEvent = event;
		});

		// Mount the HtmlDocument to the DOM
        htmlDocument.mountToDom();

        // Simulate a double click
        yield ElectronManager.doubleClickHtmlElement(htmlElement);

        Assert.true(Class.isInstance(capturedEvent, InputPressEvent), '"input.press.double" events are instances of InputPressEvent');

        //throw new Error('Throwing error to display browser window.');
	},

	testInputPressEventPropagation: function*() {
		// Create an HtmlDocument
        var htmlDocument = new HtmlDocument();

        htmlDocument.body.setStyle('margin', 0);
        htmlDocument.body.setStyle('padding', '30px');

		var grandparentElement = Html.div({
			content: 'Grandparent',
			style: 'background: #00AAFF; padding: 30px;',
		});

		var parentElement = Html.div({
			content: 'Parent',
			style: 'background: #00AAAA; padding: 30px;',
		});

		var childElement = Html.div({
			content: 'Child',
			style: 'background: #00AA66; padding: 30px;',
		});

		var grandchildElement = Html.div({
			content: 'Grandchild',
			style: 'background: #00AA00; padding: 30px;',
		});

		htmlDocument.body.append(grandparentElement.append(parentElement.append(childElement.append(grandchildElement))));

		// Set a variable to capture the event
		var grandparentCapturedEvent = null;
		var parentCapturedEvent = null;
		var childCapturedEvent = null;

		var grandparentCapturedEventCount = 0;
		var parentCapturedEventCount = 0;
		var childCapturedEventCount = 0;

		grandparentElement.on('input.press', function(event) {
			Console.standardInfo('grandparentElement', event.identifier, event);
			grandparentCapturedEventCount++;
			grandparentCapturedEvent = event;
		});

		parentElement.on('input.press', function(event) {
			Console.standardInfo('parentElement', event.identifier, event);
			parentCapturedEventCount++;
			parentCapturedEvent = event;

			// Stop the event here
			event.stop();
		});

		childElement.on('input.press', function(event) {
			Console.standardInfo('childElement', event.identifier, event);
			childCapturedEventCount++;
			childCapturedEvent = event;
		});

		// Mount the HtmlDocument to the DOM
        htmlDocument.mountToDom();

        // Click on the grandchild element
        yield ElectronManager.clickHtmlElement(grandchildElement);

        Assert.strictEqual(grandparentCapturedEvent, null, 'stopped "input.press" events do not propagate');
        Assert.true(Class.isInstance(parentCapturedEvent, InputPressEvent), '"input.press" events propagate correctly');
        Assert.true(Class.isInstance(childCapturedEvent, InputPressEvent), '"input.press" events propagate correctly');

        Assert.strictEqual(parentCapturedEvent.emitter, grandchildElement, 'emitter property on is correct');
        Assert.strictEqual(childCapturedEvent.emitter, grandchildElement, 'emitter property on is correct');

        Assert.strictEqual(grandparentCapturedEventCount, 0, 'propagated events trigger the correct number of times');
        Assert.strictEqual(parentCapturedEventCount, 1, 'propagated events trigger the correct number of times');
        Assert.strictEqual(childCapturedEventCount, 1, 'propagated events trigger the correct number of times');

        //throw new Error('Throwing error to display browser window.');
	},

});

// Export
module.exports = InputPressEventTest;