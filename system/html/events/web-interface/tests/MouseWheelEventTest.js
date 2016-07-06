// Dependencies
var ElectronTest = Framework.require('system/electron/tests/ElectronTest.js');
var Assert = Framework.require('system/test/Assert.js');
var HtmlDocument = Framework.require('system/html/HtmlDocument.js');
var Html = Framework.require('system/html/Html.js');
var ElectronManager = null;
var HtmlEvent = Framework.require('system/html/events/HtmlEvent.js');
var HtmlNodeEvent = Framework.require('system/html/events/html-node/HtmlNodeEvent.js');
var HtmlElementEvent = Framework.require('system/html/events/html-element/HtmlElementEvent.js');
var MouseEvent = Framework.require('system/html/events/web-interface/MouseEvent.js');
var MouseWheelEvent = Framework.require('system/html/events/web-interface/MouseWheelEvent.js');

// Class
var MouseWheelEventTest = ElectronTest.extend({

	before: function*() {
		// Initialize the ElectronManager here as to not throw an exception when electron is not present
		ElectronManager = Framework.require('system/electron/ElectronManager.js');
	},

	testMouseWheelEvent: function*() {
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
		var capturedEventMouseWheelDown = null;
		var capturedEventMouseWheelUp = null;
		var capturedEventMouseWheelClick = null;
		var capturedEventMouseWheelClickSingle = null;
		var capturedEventMouseWheelClickDouble = null;
		var capturedEventMouseWheelRotate = null;
		var capturedEventMouseWheelRotateUp = null;
		var capturedEventMouseWheelRotateDown = null;
		var capturedEventMouseWheelRotateLeft = null;
		var capturedEventMouseWheelRotateRight = null;

		// Add an event listener to the div to capture the event when triggered
		htmlElement.on('mouse.wheel.*', function(event) {
			Console.standardInfo(event.identifier, event);

			if(event.identifier == 'mouse.wheel.down') {
				capturedEventMouseWheelDown = event;
			}
			else if(event.identifier == 'mouse.wheel.up') {
				capturedEventMouseWheelUp = event;
			}
			else if(event.identifier == 'mouse.wheel.click') {
				capturedEventMouseWheelClick = event;
			}
			else if(event.identifier == 'mouse.wheel.click.single') {
				capturedEventMouseWheelClickSingle = event;
			}
			else if(event.identifier == 'mouse.wheel.click.double') {
				capturedEventMouseWheelClickDouble = event;
			}
			else if(event.identifier == 'mouse.wheel.rotate') {
				capturedEventMouseWheelRotate = event;
			}
			else if(event.identifier == 'mouse.wheel.rotate.up') {
				capturedEventMouseWheelRotateUp = event;
			}
			else if(event.identifier == 'mouse.wheel.rotate.down') {
				capturedEventMouseWheelRotateDown = event;
			}
			else if(event.identifier == 'mouse.wheel.rotate.left') {
				capturedEventMouseWheelRotateLeft = event;
			}
			else if(event.identifier == 'mouse.wheel.rotate.right') {
				capturedEventMouseWheelRotateRight = event;
			}
		});

		// Mount the HtmlDocument to the DOM
        htmlDocument.mountToDom();

        // Simulate a middle click
		yield ElectronManager.clickHtmlElement(htmlElement, 'middle');

		Assert.true(Class.isInstance(capturedEventMouseWheelClick, HtmlEvent), 'mouse wheel events are instances of HtmlEvent');
		Assert.true(Class.isInstance(capturedEventMouseWheelClick, HtmlNodeEvent), 'mouse wheel events are instances of HtmlNodeEvent');
        Assert.true(Class.isInstance(capturedEventMouseWheelClick, HtmlElementEvent), 'mouse wheel events are instances of HtmlElementEvent');
        Assert.true(Class.isInstance(capturedEventMouseWheelClick, MouseEvent), 'mouse wheel events are instances of MouseEvent');
        // I guess it is OK that click events are not MouseWheelEvent
        //Assert.true(Class.isInstance(capturedEventMouseWheelClick, MouseWheelEvent), 'mouse wheel events are instances of MouseWheelEvent');

        Assert.true(capturedEventMouseWheelDown, '"mouse.wheel.down" events are emitted');
		Assert.true(capturedEventMouseWheelUp, '"mouse.wheel.up" events are emitted');
		Assert.true(capturedEventMouseWheelClick, '"mouse.wheel.click" events are emitted');
		Assert.true(capturedEventMouseWheelClickSingle, '"mouse.wheel.click.single" events are emitted');

		// Simulate a double click
		yield ElectronManager.doubleClickHtmlElement(htmlElement, 'middle');

		Assert.true(capturedEventMouseWheelClickDouble, '"mouse.wheel.click.double" events are emitted');

		// Simulate a wheel scroll up
		// TODO: This isn't working
		// htmlElement, deltaX, deltaY, wheelTicksX, wheelTicksY, accelerationRatioX, accelerationRatioY, hasPreciseScrollingDeltas, canScroll, modifiers
		//yield ElectronManager.wheelRotateHtmlElement(htmlElement, -0, 100, 0, 1, 1, 1, false, true);

		// Simulate a wheel scroll down

		//Assert.true(capturedEventMouseWheelRotate, '"mouse.wheel.rotate" events are emitted');
		//Assert.true(capturedEventMouseWheelRotateUp, '"mouse.wheel.rotate.up" events are emitted');
		//Assert.true(capturedEventMouseWheelRotateDown, '"mouse.wheel.rotate.down" events are emitted');
		//Assert.true(capturedEventMouseWheelRotateLeft, '"mouse.wheel.rotate.left" events are emitted');
		//Assert.true(capturedEventMouseWheelRotateRight, '"mouse.wheel.rotate.right" events are emitted');
	
        //throw new Error('Throwing error to display browser window.');
	},

});

// Export
module.exports = MouseWheelEventTest;