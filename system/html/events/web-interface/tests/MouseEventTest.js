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
			//Console.log(event.domEvent.detail);
			capturedEvent = event;
		});

		// Mount the HtmlDocument to the DOM
        htmlDocument.mountToDom();

        // Simulate a click
        yield ElectronManager.clickHtmlElement(htmlElement);
        //yield ElectronManager.clickHtmlElement(htmlElement);

        Assert.true(Class.isInstance(capturedEvent, MouseEvent), '"interact" events triggered by clicks are instances of MouseEvent');

        Assert.strictEqual(capturedEvent.type, 'click', 'type property is correctly set');

        Assert.strictEqual(capturedEvent.keyboardKeysDown.alt, false, 'keyboardKeysDown.alt property is correctly set');
        Assert.strictEqual(capturedEvent.keyboardKeysDown.ctrl, false, 'keyboardKeysDown.alt property is correctly set');
        Assert.strictEqual(capturedEvent.keyboardKeysDown.meta, false, 'keyboardKeysDown.alt property is correctly set');
        Assert.strictEqual(capturedEvent.keyboardKeysDown.shift, false, 'keyboardKeysDown.alt property is correctly set');
       
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

		Assert.strictEqual(capturedEvent.device.capabilities.touch, false, 'device.capabilities.touch property is correctly set');
	
        throw error;
	},

	testMouseEventMouseButtonOneClick: function*() {
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
		htmlElement.on('mouse.button.one.click', function(event) {
			Console.standardInfo(event.identifier, event);
			capturedEvent = event;
		});

		// Mount the HtmlDocument to the DOM
        htmlDocument.mountToDom();

        // Simulate a click
        yield ElectronManager.clickHtmlElement(htmlElement);

        Assert.true(Class.isInstance(capturedEvent, MouseEvent), '"interact" events triggered by clicks are instances of MouseEvent');

        Assert.strictEqual(capturedEvent.type, 'click', 'type property is correctly set');

        Assert.strictEqual(capturedEvent.keyboardKeysDown.alt, false, 'keyboardKeysDown.alt property is correctly set');
        Assert.strictEqual(capturedEvent.keyboardKeysDown.ctrl, false, 'keyboardKeysDown.alt property is correctly set');
        Assert.strictEqual(capturedEvent.keyboardKeysDown.meta, false, 'keyboardKeysDown.alt property is correctly set');
        Assert.strictEqual(capturedEvent.keyboardKeysDown.shift, false, 'keyboardKeysDown.alt property is correctly set');
       
        Assert.strictEqual(capturedEvent.mouseButtonsDown[1], false, 'mouseButtonsDown[1] property is correctly set');
        Assert.strictEqual(capturedEvent.mouseButtonsDown[2], false, 'mouseButtonsDown[2] property is correctly set');
        Assert.strictEqual(capturedEvent.mouseButtonsDown[3], false, 'mouseButtonsDown[3] property is correctly set');
        Assert.strictEqual(capturedEvent.mouseButtonsDown[4], false, 'mouseButtonsDown[4] property is correctly set');
        Assert.strictEqual(capturedEvent.mouseButtonsDown[5], false, 'mouseButtonsDown[5] property is correctly set');

		Assert.strictEqual(capturedEvent.button, 1, 'button property is correctly set');

		// Cannot test these as the browser window is hidden
		//Assert.strictEqual(capturedEvent.position.relativeToGlobal.x, 0, 'position.relativeToGlobal.x property is correctly set');
		//Assert.strictEqual(capturedEvent.position.relativeToGlobal.y, 0, 'position.relativeToGlobal.y property is correctly set');
		//Assert.strictEqual(capturedEvent.position.relativeToPreviousGlobalRelativePosition.x, 0, 'position.relativeToPreviousGlobalRelativePosition.x property is correctly set');
		//Assert.strictEqual(capturedEvent.position.relativeToPreviousGlobalRelativePosition.y, 0, 'position.relativeToPreviousGlobalRelativePosition.y property is correctly set');

		Assert.strictEqual(capturedEvent.relatedEmitter, null, 'relatedEmitter property is correctly set');
		Assert.strictEqual(capturedEvent.relatedEmitterDomNode, null, 'relatedEmitterDomNode property is correctly set');

		Assert.strictEqual(capturedEvent.clickCount, 1, 'clickCount property is correctly set');

		Assert.strictEqual(capturedEvent.device.capabilities.touch, false, 'device.capabilities.touch property is correctly set');
	
        //throw error;
	},

});

// Export
module.exports = MouseEventTest;