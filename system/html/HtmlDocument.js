// Dependencies
var XmlDocument = Framework.require('system/xml/XmlDocument.js');
var Html = Framework.require('system/html/Html.js');
var HtmlDocumentEventEmitter = Framework.require('system/html/events/html-document/HtmlDocumentEventEmitter.js');
var Url = Framework.require('system/web/Url.js');

// Class
var HtmlDocument = XmlDocument.extend({

	type: 'html',

	domDocument: null,
	domWindow: null,
	isMountedToDom: false,
	//shouldScheduleDomUpdates: false, // Testing
	shouldScheduleDomUpdates: true,
	domUpdatesScheduled: false,
	domUpdates: {},

	// Views
	view: null,
	head: null,
	body: null,
	titleHtmlElement: null,

	url: null,

	dimensions: {
		width: null,
		height: null,
		visible: {
			width: null,
			height: null,
		},
	},

	position: {
		relativeToRelativeAncestor: {
			x: null, // scrollLeft
			y: null, // scrollTop
		},

		relativeToDocumentViewport: {
			x: null,
			y: null,

			coordinates: {
				topLeft: {
					x: null,
					y: null,
				},
				topCenter: {
					x: null,
					y: null,
				},
				topRight: {
					x: null,
					y: null,
				},

				leftCenter: {
					x: null,
					y: null,
				},

				rightCenter: {
					x: null,
					y: null,
				},

				bottomLeft: {
					x: null,
					y: null,
				},
				bottomCenter: {
					x: null,
					y: null,
				},
				bottomRight: {
					x: null,
					y: null,
				},

				center: {
					x: null,
					y: null,
				},
			},

			edges: {
				top: null,
				right: null,
				bottom: null,
				left: null,
			},						
		},

		//relativeToDocument
		//relativeToGlobal
		//relativeToPreviousGlobalRelativePosition
	},

	construct: function(declaration) {
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
			//Console.log('DOM present, HtmlDocument connected to DOM', this);

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
	},

	mountToDom: function() {
		//Console.log('HtmlDocument mountToDom');

		// Clear the head and body in preparation for writing the HTML document to the DOM
		// Even though we are removing script references from <head>, any previously included scripts will still have code available (we want this to be the case)
		this.head.emptyDomNode();
		this.body.emptyDomNode();

		//Console.log('HtmlDocument.mountToDom', this);

		// Add this.view to the DOM
		this.view.executeDomUpdate();

		// At this point the HtmlDocument has been added to the DOM
		this.mountedToDom();
	},

	mountedToDom: function() {
		//Console.log('HtmlDocument mountedToDom');

		// The HtmlDocument is now added to the DOM
		this.isMountedToDom = true;

		this.emit('htmlDocument.mountedToDom', this);

		//this.printDomUpdates();

		// Now that all of the callbacks have run, execute any pending DOM updates
		this.executeDomUpdates();
	},

	printDomUpdates: function() {
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
	},

	updateDom: function(htmlNode) {
		//Console.log('HtmlDocument.updateDom', htmlNode);
		//Console.log('HtmlDocument.shouldScheduleDomUpdates', this.shouldScheduleDomUpdates);

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
	},

	scheduleDomUpdate: function(htmlNode) {
		//Console.log('HtmlDocument.scheduleDomUpdate', htmlNode.tag, Json.encode(htmlNode.attributes));

		// Add the HtmlElement to the list of updates to do
		if(htmlNode) {
			// Use an object instead of an array so we get the speed of the hash table for deduping updates
			this.domUpdates[htmlNode.nodeIdentifier] = htmlNode;
		}

		// If an update isn't scheduled already, use the next animation frame to run all updates
		if(!this.domUpdatesScheduled) {
			//Console.log('scheduling executeDomUpdates');
			this.domUpdatesScheduled = true;

			this.domWindow.requestAnimationFrame(function() {
				//console.info('this.domWindow.requestAnimationFrame');
				this.executeDomUpdates();
			}.bind(this));
		}
		else {
			//Console.log('executeDomUpdates already scheduled')
		}

		//Console.log('this.domUpdates', this.domUpdates);
	},

	executeDomUpdates: function() {
		//Console.log('HtmlDocument.executeDomUpdates', 'this.domUpdates', this.domUpdates);

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
	},

	setTitle: function(title) {
		// Create the title tag if it doesn't exist
		if(!this.titleHtmlElement) {
			this.titleHtmlElement = Html.title(title);
			this.head.append(this.titleHtmlElement);
		}
		// If it title tag does exist, use domDocument to change it
		else if(this.domDocument) {
			this.domDocument.title = title;
		}
	},

	addScript: function(path) {
		this.head.append(Html.script({
			src: path,
		}));
	},

	addStyleSheet: function(path) {
		this.head.append(Html.link({
			rel: 'stylesheet',
			href: path,
		}));
	},

	insertText: function(text) {
		var textInserted = false;

		if(this.domDocument) {
			textInserted = this.domDocument.execCommand('insertText', false, text);
		}

		return textInserted;
	},

	executeCut: function() {
		return this.domDocument.execCommand('copy', false, null);
	},

	executeCopy: function() {
		return this.domDocument.execCommand('cut', false, null);
	},

	executePaste: function() {
		return this.domDocument.execCommand('paste', false, null);
	},

	print: function() {
		this.domWindow.print();
	},

	getSelection: function() {
		return this.domWindow.getSelection();
	},

	getSelectionText: function() {
		var text = '';

        if(this.domWindow.getSelection) {
            text = this.domWindow.getSelection();
        }
        else if(this.domDocument.selection && this.domDocument.selection.type != 'Control') {
            text = this.domDocument.selection.createRange().text;
        }

        Console.log('htmlDocument.getSelectionText', text);

        return text;
	},

	getDimensions: function() {
		this.getDimensionAndPositionFromDomDocument();

		return this.dimensions;
	},

	getPosition: function() {
		this.getDimensionAndPositionFromDomDocument();

		return this.position;
	},

	getDimensionAndPositionFromDomDocument: function() {
		if(this.domDocument) {
			// Dimensions
			this.dimensions.width = this.domDocument.documentElement.scrollWidth;
			this.dimensions.height = this.domDocument.documentElement.scrollHeight;
			this.dimensions.visible.width = this.domDocument.documentElement.clientWidth;
			this.dimensions.visible.height = this.domDocument.documentElement.clientHeight;

			// Position - relativeToRelativeAncestor
			this.position.relativeToRelativeAncestor.x = this.domDocument.scrollingElement.scrollTop;
			this.position.relativeToRelativeAncestor.y = this.domDocument.scrollingElement.scrollLeft;

			// Position - relativeToDocumentViewport
			this.position.relativeToDocumentViewport.x = 0;
			this.position.relativeToDocumentViewport.y = 0;

			this.position.relativeToDocumentViewport.coordinates.topLeft.x = 0;
			this.position.relativeToDocumentViewport.coordinates.topLeft.y = 0;
						
			this.position.relativeToDocumentViewport.coordinates.topCenter.x = this.domWindow.innerWidth / 2;
			this.position.relativeToDocumentViewport.coordinates.topCenter.y = 0;
						
			this.position.relativeToDocumentViewport.coordinates.topRight.x = this.domWindow.innerWidth;
			this.position.relativeToDocumentViewport.coordinates.topRight.y = 0;

			this.position.relativeToDocumentViewport.coordinates.leftCenter.x = 0;
			this.position.relativeToDocumentViewport.coordinates.leftCenter.y = this.domWindow.innerHeight / 2;

			this.position.relativeToDocumentViewport.coordinates.rightCenter.x = this.domWindow.innerWidth;
			this.position.relativeToDocumentViewport.coordinates.rightCenter.y = this.domWindow.innerHeight / 2;

			this.position.relativeToDocumentViewport.coordinates.bottomLeft.x = 0;
			this.position.relativeToDocumentViewport.coordinates.bottomLeft.y = this.domWindow.innerHeight;
						
			this.position.relativeToDocumentViewport.coordinates.bottomCenter.x = this.domWindow.innerWidth / 2;
			this.position.relativeToDocumentViewport.coordinates.bottomCenter.y = this.domWindow.innerHeight;
						
			this.position.relativeToDocumentViewport.coordinates.bottomRight.x = this.domWindow.innerWidth;
			this.position.relativeToDocumentViewport.coordinates.bottomRight.y = this.domWindow.innerHeight;

			this.position.relativeToDocumentViewport.coordinates.center.x = this.domWindow.innerWidth / 2;
			this.position.relativeToDocumentViewport.coordinates.center.y = this.domWindow.innerHeight / 2;

			this.position.relativeToDocumentViewport.edges = 0;
			this.position.relativeToDocumentViewport.edges = this.domWindow.innerWidth;
			this.position.relativeToDocumentViewport.edges = this.domWindow.innerHeight;
			this.position.relativeToDocumentViewport.edges = 0;
		}

		return {
			dimensions: this.dimensions,
			position: this.position,
		};
	},

	find: function(selector) {
		var result = null;
		var domNode = this.domDocument.querySelector(selector);
		//Console.standardInfo(domNodes);

		if(domNode && domNode.htmlNode) {
			result = domNode.htmlNode;
		}		

		return result;
	},

});

// Static methods

HtmlDocument.is = function(value) {
	return Class.isInstance(value, HtmlDocument);
};

// Class implementations
HtmlDocument.implement(HtmlDocumentEventEmitter);

// Export
module.exports = HtmlDocument;