// Dependencies
var ElectronTest = Framework.require('system/electron/tests/ElectronTest.js');
var Assert = Framework.require('system/test/Assert.js');
var HtmlDocument = Framework.require('system/html/HtmlDocument.js');
var Html = Framework.require('system/html/Html.js');
var ElectronManager = null;
var HtmlElementEvent = Framework.require('system/html/events/html-element/HtmlElementEvent.js');

// Class
var HtmlElementEventTest = ElectronTest.extend({

	before: function*() {
		// Initialize the ElectronManager here as to not throw an exception when electron is not present
		ElectronManager = Framework.require('system/electron/ElectronManager.js');
	},

	testHtmlElementEventFocus: function*() {
		// Create an HtmlDocument
        var htmlDocument = new HtmlDocument();

        htmlDocument.body.setStyle('margin', 0);
        htmlDocument.body.setStyle('padding', '30px');

        // A textArea element
        var textAreaElement = Html.textarea();
        htmlDocument.body.append(textAreaElement);

		// Set a variable to capture the event
		var capturedHtmlElementFocusEvent = null;
		var capturedHtmlElementBlurEvent = null;

		// Add an event listener to the textarea to capture the event when triggered
		textAreaElement.on('htmlElement.*', function(event) {
			Console.standardInfo(event.identifier, event);

			if(event.identifier == 'htmlElement.focus') {
				capturedHtmlElementFocusEvent = event;
			}
			else if(event.identifier == 'htmlElement.blur') {
				capturedHtmlElementBlurEvent = event;
			}
		});

		// Mount the HtmlDocument to the DOM
        htmlDocument.mountToDom();

        // Click into the textArea
		yield ElectronManager.clickHtmlElement(textAreaElement);

		// Click out of the textArea
		yield ElectronManager.clickHtmlElement(htmlDocument.body);

		Assert.true(Class.isInstance(capturedHtmlElementFocusEvent, HtmlElementEvent), '"htmlElement.focus" events are instances of HtmlElementEvent');
		Assert.true(Class.isInstance(capturedHtmlElementBlurEvent, HtmlElementEvent), '"htmlElement.blur" events are instances of HtmlElementEvent');

		//throw new Error('Throwing error to display browser window.');
	},

	testHtmlElementEventScroll: function*() {
		// Create an HtmlDocument
        var htmlDocument = new HtmlDocument();

        htmlDocument.body.setStyle({
        	margin: 0,
        	padding: '30px',
    	});

        // A scrollable div
        var scrollableDivElement = Html.div('Scrollable');
        scrollableDivElement.setStyle({
        	height: '100px',
        	background: '#00AAFF',
        	padding: '30px',
        	overflow: 'scroll',
        });

        var tallDivElement = Html.div('Tall');
        tallDivElement.setStyle({
        	height: '500px',
        	background: '#00AA66',
        });

        scrollableDivElement.append(tallDivElement);

        htmlDocument.body.append(scrollableDivElement);

		// Set a variable to capture the event
		var capturedHtmlElementScrollEvent = null;
		var capturedHtmlElementScrollUpEvent = null;
		var capturedHtmlElementScrollDownEvent = null;

		// Add an event listener to the textarea to capture the event when triggered
		scrollableDivElement.on('htmlElement.*', function(event) {
			Console.standardInfo(event.identifier, event);

			if(event.identifier == 'htmlElement.scroll') {
				capturedHtmlElementScrollEvent = event;
			}
			else if(event.identifier == 'htmlElement.scroll.up') {
				capturedHtmlElementScrollUpEvent = event;
			}
			else if(event.identifier == 'htmlElement.scroll.down') {
				capturedHtmlElementScrollDownEvent = event;
			}
		});

		// Mount the HtmlDocument to the DOM
        htmlDocument.mountToDom();

        // Click into the textArea
		yield ElectronManager.clickHtmlElement(scrollableDivElement);

		// Click out of the textArea
		yield ElectronManager.clickHtmlElement(htmlDocument.body);

		Assert.true(Class.isInstance(capturedHtmlElementScrollEvent, HtmlElementEvent), '"htmlElement.scroll" events are instances of HtmlElementEvent');
		Assert.true(Class.isInstance(capturedHtmlElementScrollUpEvent, HtmlElementEvent), '"htmlElement.scroll.up" events are instances of HtmlElementEvent');
		Assert.true(Class.isInstance(capturedHtmlElementScrollDownEvent, HtmlElementEvent), '"htmlElement.scroll.down" events are instances of HtmlElementEvent');

		throw new Error('Throwing error to display browser window.');
	},

});

// Export
module.exports = HtmlElementEventTest;