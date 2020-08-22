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

	cachedDimensions = null;
	get dimensions() {
		var dimensions = this.calculateDimensionsAndPosition().dimensions;

		this.cachedDimensions = dimensions;

		return dimensions;
	}

	cachedPosition = null;
	get position() {
		var position = this.calculateDimensionsAndPosition().position;

		this.cachedPosition = position;

		return position;
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

		// Manually set the <html> tag to the children array
		this.children = [
			this.view,
		];

		// Establish a reference to the HtmlDocument
		this.view.htmlDocument = this;

		// Create the head and body tags
		this.head = Html.head();
		this.body = Html.body();
	}

	// Called by WebGraphicalInterfaceAdapter.initialize
	initialize() {
		// If the DOM is present, reference the DOM document
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

			// Remove the text node between the head and body
			if(this.head.domNode.nextSibling != this.body.domNode) {
				this.head.domNode.parentNode.removeChild(this.head.domNode.nextSibling);
			}

			// Clear the body in preparation for writing the HTML document to the DOM
			this.body.domNode.innerHTML = ''; // Use this method to quickly empty the node

			// Inherit attributes from the body
			//console.log('this.domDocument.body.attributes', this.domDocument.body.attributes);
			this.domDocument.body.attributes.each(function(attributeIndex, attribute) {
				this.body.attributes[attribute.nodeName] = attribute.nodeValue; // Do not use setAttribute a this will trigger an unneccessary render
			}.bind(this));

			// Set the URL
			this.url = new Url(this.domDocument.location.toString());
		}

		// Manually set the children (do not use .append as this will cause unnecessary renders)
		this.head.setParent(this.view);
		this.body.setParent(this.view);
		this.view.children = [
			this.head,
			this.body,
		];

		// If the DOM is present
		if(this.domDocument) {
			// At this point the HtmlDocument has been added to the DOM
			this.mountedToDom();
		}
	}

	mountedToDom() {
		//app.log('HtmlDocument mountedToDom', this);
		this.emit('htmlDocument.mountedToDom', this);

		//this.printDomUpdates();

		// Now that all of the callbacks have run, execute any pending DOM updates
		// TODO: I think we can remove this line
		//this.executeDomUpdates();
	}

	printDomUpdates() {
		console.info('**************************************');
		console.info('Pending DOM Updates (nodes that have attributes or children modified):')

		if(Object.isEmpty(this.domUpdates)) {
			console.info('No updates.');
		}
		else {
			this.domUpdates.each(function(htmlNodeIdentifier, htmlNode) {
				console.info(htmlNodeIdentifier, 'tag', htmlNode.tag, 'content', htmlNode.content, 'attributes', htmlNode.attributes);
			});
		}
		console.info('**************************************');
	}

	render(htmlNode) {
		//app.log('HtmlDocument.render', htmlNode);
		//app.log('HtmlDocument.shouldScheduleDomUpdates', this.shouldScheduleDomUpdates);

		// Do nothing if the HtmlDocument is not added to the DOM yet
		if(this.domDocument === null) {
			//console.info('HtmlDocument .render - Skipping render, HtmlDocument is not mounted to the DOM yet (HtmlDocument .domDocument is null)');
		}
		// If DOM update scheduling is enabled
		else if(this.shouldScheduleDomUpdates) {
			//console.log('HtmlDocument .render - Scheduling update', htmlNode);
			this.scheduleDomUpdate(htmlNode);
		}
		// If not, immediately update the DOM
		else {
			// Do not uncomment this console warning
			console.warn('HtmlDocument in immediate rendering mode. You must be testing. Switch htmlDocument.shouldScheduleDomUpdates to true when done testing.', htmlNode);
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
		//this.printDomUpdates();

		// Iterate over all DOM updates
		this.domUpdates.each(function(htmlNodeIdentifier, htmlNode) {
			//console.log('htmlNode.executeDomUpdate', htmlNode);

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

	calculateDimensionsAndPosition() {
		var dimensionsAndPosition = {
			dimensions: new Dimensions(),
			position: {
				relativeToDocument: new Position(),
				relativeToDocumentViewport: new Position(),
				relativeToDisplay: new Position(),
				relativeToAllDisplays: new Position(),
				relativeToPreviousGlobalRelativePosition: new Position(),
				relativeToRelativeAncestor: new Position(),
			},
		};

		if(this.domDocument) {
			// Dimensions
			dimensionsAndPosition.dimensions.width = this.domDocument.documentElement.scrollWidth;
			dimensionsAndPosition.dimensions.height = this.domDocument.documentElement.scrollHeight;
			dimensionsAndPosition.dimensions.visible.width = this.domDocument.documentElement.clientWidth;
			dimensionsAndPosition.dimensions.visible.height = this.domDocument.documentElement.clientHeight;

			// Position - relativeToRelativeAncestor
			dimensionsAndPosition.position.relativeToRelativeAncestor.x = this.domDocument.scrollingElement.scrollLeft;
			dimensionsAndPosition.position.relativeToRelativeAncestor.y = this.domDocument.scrollingElement.scrollTop;
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
