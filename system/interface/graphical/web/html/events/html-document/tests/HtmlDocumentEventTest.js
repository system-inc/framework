// Dependencies
import ElectronTest from 'framework/system/interface/graphical/electron/tests/ElectronTest.js';
import Assert from 'framework/system/test/Assert.js';
import HtmlDocument from 'framework/system/interface/graphical/web/html/HtmlDocument.js';
import Html from 'framework/system/interface/graphical/web/html/Html.js';
import HtmlDocumentEvent from 'framework/system/interface/graphical/web/html/events/html-document/HtmlDocumentEvent.js';
import HtmlEvent from 'framework/system/interface/graphical/web/html/events/html-event/HtmlEvent.js';
var ElectronManager = null;

// Class
class FormEventTest extends ElectronTest {

	async before() {
    	// Initialize the ElectronManager here as to not throw an exception when electron is not present
    	ElectronManager = Framework.require('framework/system/electron/ElectronManager.js');
	}

	async testHtmlDocumentEventCustomDomEvents() {
    	// Create an HtmlDocument
        var htmlDocument = new HtmlDocument();

        // Set a variable to capture the event
    	var capturedMountedToDomEvent = null;
    	var capturedDomUpdatesExecutedEvent = null;

        htmlDocument.on('htmlDocument.*', function(event) {
            Console.standardWarn(event.identifier, event);

            if(event.identifier == 'htmlDocument.mountedToDom') {
                capturedMountedToDomEvent = event;
            }
            else if(event.identifier == 'htmlDocument.domUpdatesExecuted') {
                capturedDomUpdatesExecutedEvent = event;
            }
        });

    	// Mount the HtmlDocument to the DOM
        htmlDocument.mountToDom();

        // capturedMountedToDomEvent should be an HtmlDocumentEvent
        Assert.true(Class.isInstance(capturedMountedToDomEvent, HtmlDocumentEvent), '"htmlDocument.mountedToDom" events are instances of HtmlDocumentEvent');

        // capturedDomUpdatesExecutedEvent should be an HtmlDocumentEvent
        Assert.true(Class.isInstance(capturedDomUpdatesExecutedEvent, HtmlDocumentEvent), '"htmlDocument.domUpdatesExecuted" events are instances of HtmlDocumentEvent');

    	//throw new Error('Throwing error to display browser window.');
	}

    async testHtmlDocumentEventUrlFragmentChange() {
        // Create an HtmlDocument
        var htmlDocument = new HtmlDocument();

        // Create a link to change the fragment
        var aElement = Html.a({
            content: 'Go to #testDiv',
            href: '#testDiv',
        });
        htmlDocument.body.append(aElement);

        var aElementForStartingFragment = Html.a({
            content: 'Go to #'+htmlDocument.url.fragment,
            href: '#'+htmlDocument.url.fragment,
        });
        htmlDocument.body.append(aElementForStartingFragment);

        // Create a div HtmlElement
        var htmlElement = Html.div({
            id: 'testDiv',
            content: '#testDiv',
            style: 'background: #EFEFEF; padding: 30px;',
        });
        htmlDocument.body.append(htmlElement);

        // Set a variable to capture the events
        var capturedEventHtmlDocumentUrlFragmentChange = null;

        htmlDocument.on('htmlDocument.url.fragment.change', function(event) {
            Console.standardWarn(event.identifier, event);
            capturedEventHtmlDocumentUrlFragmentChange = event;
        });

        // Mount the HtmlDocument to the DOM
        htmlDocument.mountToDom();

        // Click the link to change the fragment
        aElement.click();
        await Function.delay(50); // Give some time for the event to emit

        Assert.strictEqual(capturedEventHtmlDocumentUrlFragmentChange.data, htmlDocument.url, 'htmlDocument.url.fragment.change events emit correctly');

        // Need to go back to the original URL as Assistant app needs to use the fragment to identify the browser window
        aElementForStartingFragment.click();
        await Function.delay(50); // Give some time for the event to emit

        //throw new Error('Throwing error to display browser window.');
    }

    async testHtmlDocumentEventUnloadBefore() {
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
        var capturedEventHtmlDocumentUnloadBefore = null;

        htmlDocument.on('htmlDocument.unload.before', function(event) {
            Console.standardWarn(event.identifier, event);
            capturedEventHtmlDocumentUnloadBefore = event;
            return undefined;
        });

        // Mount the HtmlDocument to the DOM
        htmlDocument.mountToDom();

        //throw new Error('Throwing error to display browser window.');
    }

    async testHtmlDocumentEventResize() {
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
    }

    async testHtmlDocumentEventScroll() {
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
        await Function.delay(50); // Give some time for the scroll event to emit

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
        await Function.delay(50); // Give some time for the scroll event to emit

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
        await Function.delay(50); // Give some time for the scroll event to emit

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
        await Function.delay(50); // Give some time for the scroll event to emit

        Assert.true(Class.isInstance(capturedHtmlDocumentScrollLeftEvent, HtmlEvent), '"htmlDocument.scroll.left" events are instances of HtmlEvent');

        // Make sure none of the other events have been emitted
        Assert.strictEqual(capturedHtmlDocumentScrollUpEvent, null, 'scroll events emit correctly');
        Assert.strictEqual(capturedHtmlDocumentScrollDownEvent, null, 'scroll events emit correctly');
        Assert.strictEqual(capturedHtmlDocumentScrollRightEvent, null, 'scroll events emit correctly');

        //throw new Error('Throwing error to display browser window.');
    }

}

// Export
export default FormEventTest;
