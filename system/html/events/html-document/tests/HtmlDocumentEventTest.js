// Dependencies
var ElectronTest = Framework.require('system/electron/tests/ElectronTest.js');
var Assert = Framework.require('system/test/Assert.js');
var HtmlDocument = Framework.require('system/html/HtmlDocument.js');
var Html = Framework.require('system/html/Html.js');
var ElectronManager = null;
var HtmlDocumentEvent = Framework.require('system/html/events/html-document/HtmlDocumentEvent.js');
var HtmlEvent = Framework.require('system/html/events/html-event/HtmlEvent.js');

// Class
var FormEventTest = ElectronTest.extend({

	before: function*() {
    	// Initialize the ElectronManager here as to not throw an exception when electron is not present
    	ElectronManager = Framework.require('system/electron/ElectronManager.js');
	},

	testHtmlDocumentEventCustomDomEvents: function*() {
    	// Create an HtmlDocument
        var htmlDocument = new HtmlDocument();

        // Set a variable to capture the event
    	var capturedMountedToDomEvent = null;
    	var capturedDomUpdatesExecutedEvent = null;

        htmlDocument.on('htmlDocument.mountedToDom', function(event) {
        	Console.standardWarn(event.identifier, event);
        	capturedMountedToDomEvent = event;
        });

        htmlDocument.on('htmlDocument.domUpdatesExecuted', function(event) {
        	Console.standardWarn(event.identifier, event);
        	capturedDomUpdatesExecutedEvent = event;
        });

    	// Mount the HtmlDocument to the DOM
        htmlDocument.mountToDom();

        // capturedMountedToDomEvent should be an HtmlDocumentEvent
        Assert.true(Class.isInstance(capturedMountedToDomEvent, HtmlDocumentEvent), '"htmlDocument.mountedToDom" events are instances of HtmlDocumentEvent');

        // capturedDomUpdatesExecutedEvent should be an HtmlDocumentEvent
        Assert.true(Class.isInstance(capturedDomUpdatesExecutedEvent, HtmlDocumentEvent), '"htmlDocument.domUpdatesExecuted" events are instances of HtmlDocumentEvent');

    	//throw new Error('Throwing error to display browser window.');
	},

    testHtmlDocumentEvents: function*() {
        // Create an HtmlDocument
        var htmlDocument = new HtmlDocument();

        // Create a div HtmlElement
        var htmlElement = Html.div({
            content: 'div',
            style: 'background: #EFEFEF; padding: 30px; height: 8192px;',
        });

        // Append the HtmlElement to the HtmlDocument body
        htmlDocument.body.append(htmlElement);

        // Set a variable to capture the events
        var capturedEventHtmlDocumentResize = null;
        var capturedEventHtmlDocumentScroll = null;
        var capturedEventHtmlDocumentScrollUp = null;
        var capturedEventHtmlDocumentScrollDown = null;
        var capturedEventHtmlDocumentScrollLeft = null;
        var capturedEventHtmlDocumentScrollRight = null;

        htmlDocument.on('htmlDocument.resize', function(event) {
            Console.standardWarn(event.identifier, event);
            capturedEventHtmlDocumentResize = event;
        });

        // Mount the HtmlDocument to the DOM
        htmlDocument.mountToDom();

        // Resize the document
        // TODO: can't test this functionality with a hidden browser window
        //var bounds = ElectronManager.getBrowserWindowBounds();
        //Console.standardInfo('bounds', bounds);
        //ElectronManager.setBrowserWindowBounds(bounds.width, bounds.height, bounds.x + 1, bounds.y);
        //Assert.true(Class.isInstance(capturedEventHtmlDocumentResize, HtmlDocumentEvent), '"htmlDocument.resize" events are instances of HtmlDocumentEvent');

        //throw new Error('Throwing error to display browser window.');
    },

    testHtmlDocumentEventScroll: function*() {
        // Create an HtmlDocument
        var htmlDocument = new HtmlDocument();

        htmlDocument.body.setStyle({
            margin: 0,
            padding: '32px',
        });

        // A scrollable div
        var scrollableDivElement = Html.div();
        scrollableDivElement.setStyle({
            height: '8192px',
            width: '8192px',
            background: '#00AAFF',
            padding: '32px',
        });
        htmlDocument.body.append(scrollableDivElement);

        // Set a variable to capture the event
        var capturedHtmlDocumentScrollEvent = null;
        var capturedHtmlDocumentScrollUpEvent = null;
        var capturedHtmlDocumentScrollDownEvent = null;
        var capturedHtmlDocumentScrollLeftEvent = null;
        var capturedHtmlDocumentScrollRightEvent = null;

        // Add an event listener to the textarea to capture the event when triggered
        htmlDocument.on('htmlDocument.scroll.*', function(event) {
            Console.standardInfo(event.identifier, event);

            if(event.identifier == 'htmlDocument.scroll') {
                capturedHtmlDocumentScrollEvent = event;
            }
            else if(event.identifier == 'htmlDocument.scroll.up') {
                capturedHtmlDocumentScrollUpEvent = event;
            }
            else if(event.identifier == 'htmlDocument.scroll.down') {
                capturedHtmlDocumentScrollDownEvent = event;
            }
            else if(event.identifier == 'htmlDocument.scroll.left') {
                capturedHtmlDocumentScrollLeftEvent = event;
            }
            else if(event.identifier == 'htmlDocument.scroll.right') {
                capturedHtmlDocumentScrollRightEvent = event;
            }
        });

        // Mount the HtmlDocument to the DOM
        htmlDocument.mountToDom();

        // Scroll down
        htmlDocument.domDocument.scrollingElement.scrollTop = 100;
        yield Function.delay(50); // Give some time for the scroll event to emit

        Assert.true(Class.isInstance(capturedHtmlDocumentScrollDownEvent, HtmlEvent), '"htmlDocument.scroll.down" events are instances of HtmlEvent');

        // Check the htmlDocument.scroll event as well
        Assert.true(Class.isInstance(capturedHtmlDocumentScrollEvent, HtmlEvent), '"htmlDocument.scroll" events are instances of HtmlEvent');

        // Make sure none of the other events have been emitted
        Assert.strictEqual(capturedHtmlDocumentScrollUpEvent, null, 'scroll events emit correctly');
        Assert.strictEqual(capturedHtmlDocumentScrollLeftEvent, null, 'scroll events emit correctly');
        Assert.strictEqual(capturedHtmlDocumentScrollRightEvent, null, 'scroll events emit correctly');

        // Reset
        capturedHtmlDocumentScrollUpEvent = null;
        capturedHtmlDocumentScrollDownEvent = null;
        capturedHtmlDocumentScrollLeftEvent = null;
        capturedHtmlDocumentScrollRightEvent = null;

        // Scroll up
        htmlDocument.domDocument.scrollingElement.scrollTop = 0;
        yield Function.delay(50); // Give some time for the scroll event to emit

        Assert.true(Class.isInstance(capturedHtmlDocumentScrollUpEvent, HtmlEvent), '"htmlDocument.scroll.up" events are instances of HtmlEvent');

        // Make sure none of the other events have been emitted
        Assert.strictEqual(capturedHtmlDocumentScrollDownEvent, null, 'scroll events emit correctly');
        Assert.strictEqual(capturedHtmlDocumentScrollLeftEvent, null, 'scroll events emit correctly');
        Assert.strictEqual(capturedHtmlDocumentScrollRightEvent, null, 'scroll events emit correctly');

        // Reset
        capturedHtmlDocumentScrollUpEvent = null;
        capturedHtmlDocumentScrollDownEvent = null;
        capturedHtmlDocumentScrollLeftEvent = null;
        capturedHtmlDocumentScrollRightEvent = null;

        // Scroll right
        htmlDocument.domDocument.scrollingElement.scrollLeft = 100;
        yield Function.delay(50); // Give some time for the scroll event to emit

        Assert.true(Class.isInstance(capturedHtmlDocumentScrollRightEvent, HtmlEvent), '"htmlDocument.scroll.right" events are instances of HtmlEvent');

        // Make sure none of the other events have been emitted
        Assert.strictEqual(capturedHtmlDocumentScrollUpEvent, null, 'scroll events emit correctly');
        Assert.strictEqual(capturedHtmlDocumentScrollDownEvent, null, 'scroll events emit correctly');
        Assert.strictEqual(capturedHtmlDocumentScrollLeftEvent, null, 'scroll events emit correctly');

        // Reset
        capturedHtmlDocumentScrollUpEvent = null;
        capturedHtmlDocumentScrollDownEvent = null;
        capturedHtmlDocumentScrollLeftEvent = null;
        capturedHtmlDocumentScrollRightEvent = null;

        // Scroll left
        htmlDocument.domDocument.scrollingElement.scrollLeft = 0;
        yield Function.delay(50); // Give some time for the scroll event to emit

        Assert.true(Class.isInstance(capturedHtmlDocumentScrollLeftEvent, HtmlEvent), '"htmlDocument.scroll.left" events are instances of HtmlEvent');

        // Make sure none of the other events have been emitted
        Assert.strictEqual(capturedHtmlDocumentScrollUpEvent, null, 'scroll events emit correctly');
        Assert.strictEqual(capturedHtmlDocumentScrollDownEvent, null, 'scroll events emit correctly');
        Assert.strictEqual(capturedHtmlDocumentScrollRightEvent, null, 'scroll events emit correctly');

        //throw new Error('Throwing error to display browser window.');
    },

});

// Export
module.exports = FormEventTest;