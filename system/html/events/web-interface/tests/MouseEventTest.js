// Dependencies
var ElectronTest = Framework.require('system/electron/tests/ElectronTest.js');
var Assert = Framework.require('system/test/Assert.js');
var HtmlDocument = Framework.require('system/html/HtmlDocument.js');
var Html = Framework.require('system/html/Html.js');
var ElectronManager = null;
var MouseEvent = Framework.require('system/html/events/web-interface/MouseEvent.js');

// Class
var MouseEventTest = ElectronTest.extend({

	before: function*() {
		// Initialize the ElectronManager here as to not throw an exception when electron is not present
		ElectronManager = Framework.require('system/electron/ElectronManager.js');
	},

	testMouseEventInteract: function*() {
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
		htmlElement.on('interact', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedEvent = event;
		});

		// Mount the HtmlDocument to the DOM
        htmlDocument.mountToDom();

        // Simulate a click
        yield ElectronManager.clickHtmlElement(htmlElement);

        Assert.true(Class.isInstance(capturedEvent, MouseEvent), '"interact" events triggered by clicks are instances of MouseEvent');

        Assert.strictEqual(capturedEvent.modifierKeysDown.alt, false, 'modifierKeysDown.alt property is correctly set');
        Assert.strictEqual(capturedEvent.modifierKeysDown.control, false, 'modifierKeysDown.control property is correctly set');
        Assert.strictEqual(capturedEvent.modifierKeysDown.meta, false, 'modifierKeysDown.meta property is correctly set');
        Assert.strictEqual(capturedEvent.modifierKeysDown.shift, false, 'modifierKeysDown.shift property is correctly set');
       
        Assert.strictEqual(capturedEvent.mouseButtonsDown[1], false, 'mouseButtonsDown[1] property is correctly set');
        Assert.strictEqual(capturedEvent.mouseButtonsDown[2], false, 'mouseButtonsDown[2] property is correctly set');
        Assert.strictEqual(capturedEvent.mouseButtonsDown[3], false, 'mouseButtonsDown[3] property is correctly set');
        Assert.strictEqual(capturedEvent.mouseButtonsDown[4], false, 'mouseButtonsDown[4] property is correctly set');
        Assert.strictEqual(capturedEvent.mouseButtonsDown[5], false, 'mouseButtonsDown[5] property is correctly set');

		Assert.strictEqual(capturedEvent.button, 1, 'button property is correctly set');

		Assert.strictEqual(capturedEvent.position.relativeToEmitter.x, 0, 'position.relativeToEmitter.x property is correctly set');
		Assert.strictEqual(capturedEvent.position.relativeToEmitter.y, 0, 'position.relativeToEmitter.y property is correctly set');
		Assert.strictEqual(capturedEvent.position.relativeToRelativeAncestor.x, 30, 'position.relativeToRelativeAncestor.x property is correctly set');
		Assert.strictEqual(capturedEvent.position.relativeToRelativeAncestor.y, 30, 'position.relativeToRelativeAncestor.y property is correctly set');
		Assert.strictEqual(capturedEvent.position.relativeToViewport.x, 30, 'position.relativeToViewport.x property is correctly set');
		Assert.strictEqual(capturedEvent.position.relativeToViewport.y, 30, 'position.relativeToViewport.y property is correctly set');
		Assert.strictEqual(capturedEvent.position.relativeToDocument.x, 30, 'position.relativeToDocument.x property is correctly set');
		Assert.strictEqual(capturedEvent.position.relativeToDocument.y, 30, 'position.relativeToDocument.y property is correctly set');

		// Cannot test these as the browser window is hidden
		//Assert.strictEqual(capturedEvent.position.relativeToGlobal.x, 0, 'position.relativeToGlobal.x property is correctly set');
		//Assert.strictEqual(capturedEvent.position.relativeToGlobal.y, 0, 'position.relativeToGlobal.y property is correctly set');
		//Assert.strictEqual(capturedEvent.position.relativeToPreviousGlobalRelativePosition.x, 0, 'position.relativeToPreviousGlobalRelativePosition.x property is correctly set');
		//Assert.strictEqual(capturedEvent.position.relativeToPreviousGlobalRelativePosition.y, 0, 'position.relativeToPreviousGlobalRelativePosition.y property is correctly set');

		Assert.strictEqual(capturedEvent.relatedEmitter, null, 'relatedEmitter property is correctly set');
		Assert.strictEqual(capturedEvent.relatedEmitterDomNode, null, 'relatedEmitterDomNode property is correctly set');

		Assert.strictEqual(capturedEvent.clickCount, 1, 'clickCount property is correctly set');

		Assert.strictEqual(capturedEvent.trusted, true, 'trusted property is correctly set');
	
        //throw new Error('Throwing error to display browser window.');
	},

	testMouseEventMouseButton1Click: function*() {
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
		htmlElement.on('mouse.*', function(event) {
		//htmlElement.on('mouse.button.1.click', function(event) {
			Console.standardWarn(event.identifier, event);
			capturedEvent = event;
		});

		// Mount the HtmlDocument to the DOM
        htmlDocument.mountToDom();

        // Simulate a click
        yield ElectronManager.clickHtmlElement(htmlElement);

        Console.standardInfo('capturedEvent', capturedEvent);

        Assert.true(Class.isInstance(capturedEvent, MouseEvent), '"mouse.button.1.click" events triggered by clicks are instances of MouseEvent');

        throw new Error('Throwing error to display browser window.');
	},

	testMouseEventPropagation: function*() {
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

		grandparentElement.on('interact', function(event) {
			Console.standardInfo('grandparentElement', event.identifier, event);
			grandparentCapturedEventCount++;
			grandparentCapturedEvent = event;
		});

		parentElement.on('interact', function(event) {
			Console.standardInfo('parentElement', event.identifier, event);
			parentCapturedEventCount++;
			parentCapturedEvent = event;

			// Stop the event here
			event.stop();
		});

		childElement.on('interact', function(event) {
			Console.standardInfo('childElement', event.identifier, event);
			childCapturedEventCount++;
			childCapturedEvent = event;
		});

		// Mount the HtmlDocument to the DOM
        htmlDocument.mountToDom();

        // Click on the grandchild element
        yield ElectronManager.clickHtmlElement(grandchildElement);

        Assert.strictEqual(grandparentCapturedEvent, null, '"interact" events propagate correctly');
        Assert.true(Class.isInstance(parentCapturedEvent, MouseEvent), '"interact" events propagate correctly');
        Assert.true(Class.isInstance(childCapturedEvent, MouseEvent), '"interact" events propagate correctly');

        Assert.strictEqual(parentCapturedEvent.emitter, grandchildElement, 'emitter property on is correct');
        Assert.strictEqual(childCapturedEvent.emitter, grandchildElement, 'emitter property on is correct');

        Assert.strictEqual(grandparentCapturedEventCount, 0, 'propagated events trigger the correct number of times');
        Assert.strictEqual(parentCapturedEventCount, 1, 'propagated events trigger the correct number of times');
        Assert.strictEqual(childCapturedEventCount, 1, 'propagated events trigger the correct number of times');

        //throw new Error('Throwing error to display browser window.');
	},

});

// Export
module.exports = MouseEventTest;