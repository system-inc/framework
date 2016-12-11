// Dependencies
import ElectronTest from 'framework/system/interface/graphical/electron/tests/ElectronTest.js';
import Assert from 'framework/system/test/Assert.js';
import HtmlDocument from 'framework/system/interface/graphical/web/html/HtmlDocument.js';
import Html from 'framework/system/interface/graphical/web/html/Html.js';
import HtmlElementEvent from 'framework/system/interface/graphical/web/html/events/html-element/HtmlElementEvent.js';
var ElectronManager = null;

// Class
class HtmlElementEventTest extends ElectronTest {

	async before() {
		// Initialize the ElectronManager here as to not throw an exception when electron is not present
		ElectronManager = Framework.require('framework/system/electron/ElectronManager.js');
	}

	async testHtmlElementEventFocus() {
		// Create an HtmlDocument
        var htmlDocument = new HtmlDocument();

        htmlDocument.body.setStyle('margin', 0);
        htmlDocument.body.setStyle('padding', '32px');

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
		await ElectronManager.clickHtmlElement(textAreaElement);

		// Click out of the textArea
		await ElectronManager.clickHtmlElement(htmlDocument.body);

		Assert.true(Class.isInstance(capturedHtmlElementFocusEvent, HtmlElementEvent), '"htmlElement.focus" events are instances of HtmlElementEvent');
		Assert.true(Class.isInstance(capturedHtmlElementBlurEvent, HtmlElementEvent), '"htmlElement.blur" events are instances of HtmlElementEvent');

		//throw new Error('Throwing error to display browser window.');
	}

	async testHtmlElementEventScroll() {
		// Create an HtmlDocument
        var htmlDocument = new HtmlDocument();

        htmlDocument.body.setStyle({
        	margin: 0,
        	padding: '32px',
    	});

        // A scrollable div
        var scrollableDivElement = Html.div('Scrollable');
        scrollableDivElement.setStyle({
        	height: '256px',
        	width: '256px',
        	background: '#00AAFF',
        	padding: '32px',
        	overflow: 'scroll',
        });

        var tallDivElement = Html.div('Tall');
        tallDivElement.setStyle({
        	height: '4096px',
        	width: '4096px',
        	background: '#00AA66',
        });

        scrollableDivElement.append(tallDivElement);

        htmlDocument.body.append(scrollableDivElement);

		// Set a variable to capture the event
		var capturedHtmlElementScrollEvent = null;
		var capturedHtmlElementScrollUpEvent = null;
		var capturedHtmlElementScrollDownEvent = null;
		var capturedHtmlElementScrollLeftEvent = null;
		var capturedHtmlElementScrollRightEvent = null;

		// Add an event listener to the textarea to capture the event when triggered
		scrollableDivElement.on('htmlElement.scroll.*', function(event) {
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
			else if(event.identifier == 'htmlElement.scroll.left') {
				capturedHtmlElementScrollLeftEvent = event;
			}
			else if(event.identifier == 'htmlElement.scroll.right') {
				capturedHtmlElementScrollRightEvent = event;
			}
		});

		// Mount the HtmlDocument to the DOM
        htmlDocument.mountToDom();

        // Scroll down
        scrollableDivElement.domNode.scrollTop = 100;
        await Function.delay(50); // Give some time for the scroll event to emit

        Assert.true(Class.isInstance(capturedHtmlElementScrollDownEvent, HtmlElementEvent), '"htmlElement.scroll.down" events are instances of HtmlElementEvent');

        // Check the htmlElement.scroll event as well
        Assert.true(Class.isInstance(capturedHtmlElementScrollEvent, HtmlElementEvent), '"htmlElement.scroll" events are instances of HtmlElementEvent');

        // Make sure none of the other events have been emitted
        Assert.strictEqual(capturedHtmlElementScrollUpEvent, null, 'scroll events emit correctly');
        Assert.strictEqual(capturedHtmlElementScrollLeftEvent, null, 'scroll events emit correctly');
        Assert.strictEqual(capturedHtmlElementScrollRightEvent, null, 'scroll events emit correctly');

        // Reset
        capturedHtmlElementScrollUpEvent = null;
		capturedHtmlElementScrollDownEvent = null;
		capturedHtmlElementScrollLeftEvent = null;
		capturedHtmlElementScrollRightEvent = null;

		// Scroll up
		scrollableDivElement.domNode.scrollTop = 0;
        await Function.delay(50); // Give some time for the scroll event to emit

        Assert.true(Class.isInstance(capturedHtmlElementScrollUpEvent, HtmlElementEvent), '"htmlElement.scroll.up" events are instances of HtmlElementEvent');

        // Make sure none of the other events have been emitted
        Assert.strictEqual(capturedHtmlElementScrollDownEvent, null, 'scroll events emit correctly');
        Assert.strictEqual(capturedHtmlElementScrollLeftEvent, null, 'scroll events emit correctly');
        Assert.strictEqual(capturedHtmlElementScrollRightEvent, null, 'scroll events emit correctly');

        // Reset
        capturedHtmlElementScrollUpEvent = null;
		capturedHtmlElementScrollDownEvent = null;
		capturedHtmlElementScrollLeftEvent = null;
		capturedHtmlElementScrollRightEvent = null;

        // Scroll right
        scrollableDivElement.domNode.scrollLeft = 100;
        await Function.delay(50); // Give some time for the scroll event to emit

        Assert.true(Class.isInstance(capturedHtmlElementScrollRightEvent, HtmlElementEvent), '"htmlElement.scroll.right" events are instances of HtmlElementEvent');

        // Make sure none of the other events have been emitted
        Assert.strictEqual(capturedHtmlElementScrollUpEvent, null, 'scroll events emit correctly');
        Assert.strictEqual(capturedHtmlElementScrollDownEvent, null, 'scroll events emit correctly');
        Assert.strictEqual(capturedHtmlElementScrollLeftEvent, null, 'scroll events emit correctly');

        // Reset
        capturedHtmlElementScrollUpEvent = null;
		capturedHtmlElementScrollDownEvent = null;
		capturedHtmlElementScrollLeftEvent = null;
		capturedHtmlElementScrollRightEvent = null;

        // Scroll left
        scrollableDivElement.domNode.scrollLeft = 0;
        await Function.delay(50); // Give some time for the scroll event to emit

        Assert.true(Class.isInstance(capturedHtmlElementScrollLeftEvent, HtmlElementEvent), '"htmlElement.scroll.left" events are instances of HtmlElementEvent');

        // Make sure none of the other events have been emitted
        Assert.strictEqual(capturedHtmlElementScrollUpEvent, null, 'scroll events emit correctly');
        Assert.strictEqual(capturedHtmlElementScrollDownEvent, null, 'scroll events emit correctly');
        Assert.strictEqual(capturedHtmlElementScrollRightEvent, null, 'scroll events emit correctly');

		//throw new Error('Throwing error to display browser window.');
	}

    async testHtmlElementEventLoad() {
        // Create an HtmlDocument
        var htmlDocument = new HtmlDocument();

        // An image element
        var imgElement = Html.img({
            src: 'file://'+Node.Path.join(app.framework.directory, 'tests', 'assets', 'media', 'images', 'poring.png'),
        });
        htmlDocument.body.append(imgElement);

        // Set a variable to capture the event
        var capturedHtmlElementLoadEvent = null;

        // Add an event listener to the textarea to capture the event when triggered
        imgElement.on('htmlElement.load', function(event) {
            Console.standardInfo(event.identifier, event);

            if(event.identifier == 'htmlElement.load') {
                capturedHtmlElementLoadEvent = event;
            }
        });

        // Mount the HtmlDocument to the DOM
        htmlDocument.mountToDom();

        await Function.delay(50); // Give some time for the image to load

        Assert.true(Class.isInstance(capturedHtmlElementLoadEvent, HtmlElementEvent), '"htmlElement.load" events are instances of HtmlElementEvent');

        //throw new Error('Throwing error to display browser window.');
    }

    async testHtmlElementEventError() {
        // Create an HtmlDocument
        var htmlDocument = new HtmlDocument();

        // An image element
        var imgElement = Html.img({
            src: 'file://'+Node.Path.join(app.framework.directory, 'tests', 'assets', 'media', 'images', 'does-not-exist-will-cause-error.png'),
        });
        htmlDocument.body.append(imgElement);

        // Set a variable to capture the event
        var capturedHtmlElementErrorEvent = null;

        // Add an event listener to the textarea to capture the event when triggered
        imgElement.on('htmlElement.error', function(event) {
            Console.standardInfo(event.identifier, event);

            if(event.identifier == 'htmlElement.error') {
                capturedHtmlElementErrorEvent = event;
            }
        });

        // Mount the HtmlDocument to the DOM
        htmlDocument.mountToDom();

        await Function.delay(50); // Give some time for the image to error

        Assert.true(Class.isInstance(capturedHtmlElementErrorEvent, HtmlElementEvent), '"htmlElement.error" events are instances of HtmlElementEvent');

        //throw new Error('Throwing error to display browser window.');
    }

}

// Export
export default HtmlElementEventTest;
