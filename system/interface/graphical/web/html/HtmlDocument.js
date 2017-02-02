// Dependencies
import XmlDocument from 'framework/system/xml/XmlDocument.js';
import Url from 'framework/system/web/Url.js';
import Html from 'framework/system/interface/graphical/web/html/Html.js';
import HtmlDocumentEventEmitter from 'framework/system/interface/graphical/web/html/events/html-document/HtmlDocumentEventEmitter.js';
import HtmlDocumentEvent from 'framework/system/interface/graphical/web/html/events/html-document/HtmlDocumentEvent.js';
import Dimensions from 'framework/system/interface/graphical/Dimensions.js';
import Position from 'framework/system/interface/graphical/Position.js';

// Class
class HtmlDocument extends XmlDocument {

	// HtmlDocumentEventEmitter
	eventClass = HtmlDocumentEvent;

	// HtmlEventEmitter
	eventListenersOnDomObject = {};

	// PropagatingEventEmitter
	eventListeners = [];

	type = 'html';

	domDocument = null;
	domWindow = null;
	isMountedToDom = false;
	//shouldScheduleDomUpdates = false; // Testing
	shouldScheduleDomUpdates = true;
	domUpdatesScheduled = false;
	domUpdates = {};

	// Views
	view = null;
	head = null;
	body = null;
	titleHtmlElement = null;

	url = null;

	get dimensions() {
		return this.calculateDimensionAndPosition().dimensions;
	}

	get position() {
		return this.calculateDimensionAndPosition().position;
	}

	constructor(declaration) {
		super();

		// Set the declaration
		if(declaration) {
			this.declaration = declaration;
		}
		else {
			this.declaration = '<!DOCTYPE '+this.type+'>';	
		}

		// An <html> tag to store the head and body
		this.view = Html.html();

		// Establish a reference to the HtmlDocument
		this.view.htmlDocument = this;

		// Create the head and body tags
		this.head = Html.head();
		this.body = Html.body();

		// If we the DOM is present, reference the DOM document
		if(global['document']) {
			// Connect this.domDocument to the global document
			this.domDocument = document;
			this.domWindow = document.defaultView; // window
			document.htmlDocument = this;
			//app.log('DOM present, HtmlDocument connected to DOM', this);

			// Manually connect this <html> HtmlElement to document.documentElement
			this.view.domNode = this.domDocument.documentElement;

			// Manually connect the head and body domNode's to the domDocument's head and body properties
			this.head.domNode = this.domDocument.head;
			this.body.domNode = this.domDocument.body;

			// Set the URL
			this.url = new Url(this.domDocument.location.toString());
		}

		this.view.append(this.head);
		this.view.append(this.body);

		// Manually set the <html> tag to the children array
		this.children = [
			this.view,
		];
	}

	mountToDom() {
		//app.log('HtmlDocument mountToDom');

		// Clear the head and body in preparation for writing the HTML document to the DOM
		// Even though we are removing script references from <head>, any previously included scripts will still have code available (we want this to be the case)
		this.head.emptyDomNode();
		this.body.emptyDomNode();

		//app.log('HtmlDocument.mountToDom', this);

		// Add this.view to the DOM
		this.view.executeDomUpdate();

		// At this point the HtmlDocument has been added to the DOM
		this.mountedToDom();
	}

	mountedToDom() {
		//app.log('HtmlDocument mountedToDom');

		// The HtmlDocument is now added to the DOM
		this.isMountedToDom = true;

		this.emit('htmlDocument.mountedToDom', this);

		//this.printDomUpdates();

		// Now that all of the callbacks have run, execute any pending DOM updates
		this.executeDomUpdates();
	}

	printDomUpdates() {
		console.info('**************************************');
		console.info('Pending DOM Updates:')

		if(Object.isEmpty(this.domUpdates)) {
			console.info('No updates.');
		}
		else {
			this.domUpdates.each(function(htmlNodeIdentifier, htmlNode) {
				console.info(htmlNodeIdentifier, htmlNode.tag, Json.encode(htmlNode.attributes));
			});
		}
		console.info('**************************************');
	}

	updateDom(htmlNode) {
		//app.log('HtmlDocument.updateDom', htmlNode);
		//app.log('HtmlDocument.shouldScheduleDomUpdates', this.shouldScheduleDomUpdates);

		// Do nothing if the HtmlDocument is not added to the DOM yet
		if(!this.isMountedToDom) {
			//console.info('HtmlDocument.updateDom ignored because HtmlDocument.isMountedToDom is false');
		}
		// If DOM update scheduling is enabled
		else if(this.shouldScheduleDomUpdates) {
			this.scheduleDomUpdate(htmlNode);
		}
		// If not, immediately update the DOM
		else {
			htmlNode.executeDomUpdate();
		}
	}

	scheduleDomUpdate(htmlNode) {
		//app.log('HtmlDocument.scheduleDomUpdate', htmlNode.tag, Json.encode(htmlNode.attributes));

		// Add the HtmlElement to the list of updates to do
		if(htmlNode) {
			// Use an object instead of an array so we get the speed of the hash table for deduping updates
			this.domUpdates[htmlNode.nodeIdentifier] = htmlNode;
		}

		// If an update isn't scheduled already, use the next animation frame to run all updates
		if(!this.domUpdatesScheduled) {
			//app.log('scheduling executeDomUpdates');
			this.domUpdatesScheduled = true;

			this.domWindow.requestAnimationFrame(function() {
				//console.info('this.domWindow.requestAnimationFrame');
				this.executeDomUpdates();
			}.bind(this));
		}
		else {
			//app.log('executeDomUpdates already scheduled')
		}

		//app.log('this.domUpdates', this.domUpdates);
	}

	executeDomUpdates() {
		//app.log('HtmlDocument.executeDomUpdates', 'this.domUpdates', this.domUpdates);

		// Iterate over all DOM updates
		this.domUpdates.each(function(htmlNodeIdentifier, htmlNode) {
			// Run the DOM updates for the HtmlElement
			htmlNode.executeDomUpdate();

			// Remove the HtmlElement from the domUpdates objects
			delete this.domUpdates[htmlNodeIdentifier];
		}.bind(this));

		// Mark all updates as completed
		this.domUpdatesScheduled = false;

		this.emit('htmlDocument.domUpdatesExecuted', this);
	}

	setTitle(title) {
		// Create the title tag if it doesn't exist
		if(!this.titleHtmlElement) {
			this.titleHtmlElement = Html.title(title);
			this.head.append(this.titleHtmlElement);
		}
		// If it title tag does exist, use domDocument to change it
		else if(this.domDocument) {
			this.domDocument.title = title;
		}
	}

	addScript(path) {
		this.head.append(Html.script({
			src: path,
		}));
	}

	addStyleSheet(path) {
		this.head.append(Html.link({
			rel: 'stylesheet',
			href: path,
		}));
	}

	insertText(text) {
		var textInserted = false;

		if(this.domDocument) {
			textInserted = this.domDocument.execCommand('insertText', false, text);
		}

		return textInserted;
	}

	executeCut() {
		return this.domDocument.execCommand('copy', false, null);
	}

	executeCopy() {
		return this.domDocument.execCommand('cut', false, null);
	}

	executePaste() {
		return this.domDocument.execCommand('paste', false, null);
	}

	print() {
		this.domWindow.print();
	}

	getSelection() {
		return this.domWindow.getSelection();
	}

	getSelectionText() {
		var text = '';

        if(this.domWindow.getSelection) {
            text = this.domWindow.getSelection();
        }
        else if(this.domDocument.selection && this.domDocument.selection.type != 'Control') {
            text = this.domDocument.selection.createRange().text;
        }

        app.log('htmlDocument.getSelectionText', text);

        return text;
	}

	calculateDimensionAndPosition() {
		var dimensionsAndPosition = {
			dimensions: new Dimensions(),
			position: {
				relativeToRelativeAncestor: new Position(),
				relativeToDocumentViewport: new Position(),
				relativeToDocument: new Position(),
				relativeToGlobal: new Position(),
				relativeToPreviousGlobalRelativePosition: new Position(),
			},
		};

		if(this.domDocument) {
			// Dimensions
			dimensionsAndPosition.dimensions.width = this.domDocument.documentElement.scrollWidth;
			dimensionsAndPosition.dimensions.height = this.domDocument.documentElement.scrollHeight;
			dimensionsAndPosition.dimensions.visible.width = this.domDocument.documentElement.clientWidth;
			dimensionsAndPosition.dimensions.visible.height = this.domDocument.documentElement.clientHeight;

			// Position - relativeToRelativeAncestor
			dimensionsAndPosition.position.relativeToRelativeAncestor.x = this.domDocument.scrollingElement.scrollTop;
			dimensionsAndPosition.position.relativeToRelativeAncestor.y = this.domDocument.scrollingElement.scrollLeft;
			dimensionsAndPosition.position.relativeToRelativeAncestor.calculateCoordinatesAndEdges(dimensionsAndPosition.dimensions.width, dimensionsAndPosition.dimensions.height);

			// Position - relativeToDocumentViewport
			dimensionsAndPosition.position.relativeToDocumentViewport.x = 0;
			dimensionsAndPosition.position.relativeToDocumentViewport.y = 0;
			dimensionsAndPosition.position.relativeToDocumentViewport.calculateCoordinatesAndEdges(this.domWindow.innerWidth, this.domWindow.innerHeight);
		}

		return dimensionsAndPosition;
	}

	find(selector) {
		var result = null;
		var domNode = this.domDocument.querySelector(selector);
		//console.info(domNodes);

		if(domNode && domNode.htmlNode) {
			result = domNode.htmlNode;
		}		

		return result;
	}

	static is(value) {
		return Class.isInstance(value, HtmlDocument);
	}

}

// Class implementations
Class.implement(HtmlDocument, HtmlDocumentEventEmitter);

// Export
export default HtmlDocument;
