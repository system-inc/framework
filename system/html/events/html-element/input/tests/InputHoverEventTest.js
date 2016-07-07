// Dependencies
var ElectronTest = Framework.require('system/electron/tests/ElectronTest.js');
var Assert = Framework.require('system/test/Assert.js');
var HtmlDocument = Framework.require('system/html/HtmlDocument.js');
var Html = Framework.require('system/html/Html.js');
var ElectronManager = null;
var HtmlEvent = Framework.require('system/html/events/html-event/HtmlEvent.js');
var HtmlNodeEvent = Framework.require('system/html/events/html-node/HtmlNodeEvent.js');
var HtmlElementEvent = Framework.require('system/html/events/html-element/HtmlElementEvent.js');
var InputPressEvent = Framework.require('system/html/events/html-element/input/InputPressEvent.js');
var InputHoverEvent = Framework.require('system/html/events/html-element/input/InputHoverEvent.js');

// Class
var InputHoverEventTest = ElectronTest.extend({

	before: function*() {
		// Initialize the ElectronManager here as to not throw an exception when electron is not present
		ElectronManager = Framework.require('system/electron/ElectronManager.js');
	},

	testInputHoverEvent: function*() {
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
		var capturedEventInputHover = null;
		var capturedEventInputHoverIn = null;
		var capturedEventInputHoverOut = null;
		var capturedEventInputHoverInExact = null;
		var capturedEventInputHoverOutExact = null;

		// Add an event listener to the div to capture the event when triggered
		htmlElement.on('input.hover.*', function(event) {
			Console.standardInfo(event.identifier, event);

			if(event.identifier == 'input.hover') {
				capturedEventInputHover = event;
			}
			else if(event.identifier == 'input.hover.in') {
				capturedEventInputHoverIn = event;
			}
			else if(event.identifier == 'input.hover.out') {
				capturedEventInputHoverOut = event;
			}
			else if(event.identifier == 'input.hover.in.exact') {
				capturedEventInputHoverInExact = event;
			}
			else if(event.identifier == 'input.hover.out.exact') {
				capturedEventInputHoverOutExact = event;
			}
		});

		// Mount the HtmlDocument to the DOM
        htmlDocument.mountToDom();

        var htmlElementPosition = htmlElement.getPosition();
        Console.standardInfo('htmlElementPosition', htmlElementPosition);

        // Simulate moving the mouse over
        yield ElectronManager.sendInputEventMouse('mouseMove', htmlElementPosition.relativeToDocumentViewport.coordinates.center.x, htmlElementPosition.relativeToDocumentViewport.coordinates.center.y);

        // Simulate moving the mouse out
        yield ElectronManager.sendInputEventMouse('mouseMove', 0, 0);
        
		Assert.true(capturedEventInputHover, '"input.hover" events are emitted');
		Assert.true(capturedEventInputHoverIn, '"input.hover.in" events are emitted');
		Assert.true(capturedEventInputHoverOut, '"input.hover.out" events are emitted');
		Assert.true(capturedEventInputHoverInExact, '"input.hover.in.exact" events are emitted');
		Assert.true(capturedEventInputHoverOutExact, '"input.hover.out.exact" events are emitted');
	
        //throw new Error('Throwing error to display browser window.');
	},

});

// Export
module.exports = InputHoverEventTest;