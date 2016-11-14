// Dependencies
import XmlNode from 'system/xml/XmlNode.js';
import HtmlNodeEventEmitter from './events/html-node/HtmlNodeEventEmitter.js';
import HtmlNodeEvent from './events/html-node/HtmlNodeEvent.js';

// Class
class HtmlNode extends XmlNode {

	// HtmlNodeEventEmitter
	eventClass = HtmlNodeEvent;

	// HtmlEvent
	eventListenersOnDomObject = {};

	// PropagatingEventEmitter
	eventListeners = [];

	htmlDocument = null;

	domNode = null;
	isMountedToDom = false;
	shouldExecuteDomUpdate = false; // Keep track of whether or not the HtmlElement is different from the DOM

	nodeIdentifier = null // Used to uniquely identify HtmlNodes for tree comparisons againt the DOM
	nodeIdentifierCounter = 0; // Used to ensure unique identifiers

	dimensions = {
		width: null,
		height: null,
		visible: {
			width: null,
			height: null,
		},
	};

	position = {
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
	};

	constructor(content, parent, type) {
		super(...arguments);

		this.descendFromParent();
	}

	descendFromParent(parent) {
		// Allow the parent relationship to be established with this call
		if(parent) {
			this.parent = parent;
		}

		// If we have a relationship to a parent
		if(this.parent) {
			// Set a reference to parent's htmlDocument
			this.htmlDocument = this.parent.htmlDocument;

			// If the parent does not have an identifier, give it the root identifier of '0'
			if(this.parent.nodeIdentifier === null) {
				this.parent.nodeIdentifier = '0';
			}

			// Set the identifier
			this.nodeIdentifier = this.parent.nodeIdentifier+'.'+this.parent.nodeIdentifierCounter;
			this.parent.nodeIdentifierCounter++;
		}
	}

	// Called whenever the HtmlNode changes
	updateDom() {
		//app.log('HtmlNode.updateDom()');

		// Mark the object as dirty
		this.shouldExecuteDomUpdate = true;

		// Don't do anything if we aren't connected to the DOM
		if(!this.htmlDocument) {
			//app.warn('Unable to updateDom, HtmlElement is missing the htmlDocument property.', this);
		}
		// Don't do anything if we don't have a domNode
		else if(!this.domNode) {
			//app.warn('Unable to updateDom, HtmlElement is missing the domNode property.', this);
		}
		// Register an update with the HtmlDocument
		else {
			this.htmlDocument.updateDom(this);
		}
	}

	executeDomUpdate() {
		//app.log('HtmlNode executeDomUpdate', this.tag);

		// If we should execute an update
		if(this.shouldExecuteDomUpdate) {
			// Apply the current state to the DOM
			this.applyDomUpdates();

			// Mark the update as complete
			this.domUpdateExecuted();
		}
		else {
			//console.info('No need to run updates on this element', this);
		}
	}

	domUpdateExecuted() {
		// Mark the object as clean
		this.shouldExecuteDomUpdate = false;

		this.emit('htmlNode.domUpdateExecuted', this, {
			propagationStopped: true, // Do not propagate this event
		});
	}

	applyDomUpdates() {
		// Update the DOM node's value
		this.updateDomNodeValue();
	}

	updateDomNodeValue() {
		// Make sure the string matches
		if(this.value != this.domNode.nodeValue) {
			// Must use nodeValue here because innerHTML does not exist on DOM nodes which just have text
			this.domNode.nodeValue = this.value;
		}
	}

	createDomNode(htmlNode) {
		// Allow this method to be called statically
		if(!htmlNode) {
			htmlNode = this;
		}

		// Must use document global here as this.domDocument may not be populated
		var domFragment = document.createRange().createContextualFragment(htmlNode.toString());
		//app.log('HtmlNode domFragment for', htmlNode.tag, domFragment);

		return domFragment;
	}

	appendDomNode() {
		//app.log('HtmlNode.appendDomNode', this.tag);

		var domFragment = this.createDomNode();

		//Console.standardLog('this.parent.domNode', this.parent.domNode);

		// Append the child DOM node to this node's DOM node
		var appendedNode = this.parent.domNode.appendChild(domFragment);

		// Have the child reference the newly created DOM node
		this.domNode = this.parent.domNode.lastChild;

		//Console.standardLog('this.domNode', this.domNode);

		this.mountedToDom();
	}

	replaceDomNode(indexOfChildDomNodeToReplace) {
		//app.log('HtmlNode.replaceDomNode', indexOfChildDomNodeToReplace, this.tag);

		var domFragment = this.createDomNode();

		// Replace the DOM node with the replacement fragment
		this.parent.domNode.replaceChild(domFragment, this.parent.domNode.childNodes[indexOfChildDomNodeToReplace]);

		// Have the child reference the replaced DOM node
		this.domNode = this.parent.domNode.childNodes[indexOfChildDomNodeToReplace];

		this.mountedToDom();
	}

	mountedToDom() {
		//app.log('HtmlNode mountedToDom', this.tag)
		
		// The domNode has a reference to the HtmlNode
		this.domNode.htmlNode = this;

		this.isMountedToDom = true;

		// Execute DOM updates if necessary
		this.executeDomUpdate();

		this.emit('htmlNode.mountedToDom', this, {
			propagationStopped: true, // Do not propagate this event
		});
	}

	emptyDomNode(domNode) {
		if(!domNode) {
			domNode = this.domNode;
		}

		while(domNode.firstChild) {
			domNode.removeChild(domNode.firstChild);
		}

		return domNode;
	}

	// TODO: At some point add some arguments to this function to allow it to specify the start and end offsets of the selection
	select() {
		var selection = this.htmlDocument.getSelection();
        var range = this.htmlDocument.domDocument.createRange();
        range.selectNodeContents(this.domNode);
        //Console.standardLog(selection, range);
        selection.removeAllRanges();
        selection.addRange(range);
	}

	getSelectionText() {
		var selectionText = null;

		// Get the selection from the document
		var selection = this.htmlDocument.getSelection();

		// If the node is part of the selection
		if(selection.containsNode(this.domNode, true)) {
			//Console.standardLog('selection contains node', selection);

			// Determine the direction of the selection
			var documentPositionOfAnchorNodeToFocusNode = selection.anchorNode.compareDocumentPosition(selection.focusNode);
			//console.log('documentPositionOfAnchorNodeToFocusNode', documentPositionOfAnchorNodeToFocusNode);
			var direction = 'forward';
			if(!documentPositionOfAnchorNodeToFocusNode && selection.anchorOffset > selection.focusOffset || documentPositionOfAnchorNodeToFocusNode === 2) {
				direction = 'backward';
			}
			//app.log('direction', direction);

			// The direction of the selection tells us which nodes to use to determine if the selection starts or ends in this node
			var firstNode = null;
			var firstNodeOffset = null;
			var lastNode = null;
			var lastNodeOffset = null;

			// When direction is foward we use anchor for the first node and focus for last node
			if(direction == 'forward') {
				firstNode = selection.anchorNode;
				firstNodeOffset = selection.anchorOffset;
				lastNode = selection.focusNode;
				lastNodeOffset = selection.focusOffset;
			}
			// When direction is backward we use focus for the first node and anchor for the last node
			else if(direction == 'backward') {
				firstNode = selection.focusNode;
				firstNodeOffset = selection.focusOffset;
				lastNode = selection.anchorNode;
				lastNodeOffset = selection.anchorOffset;
			}

			var selectionTextStartsInNode = false;
			var selectionTextEndsInNode = false;

			if(firstNode === this.domNode || this.domNode.contains(firstNode)) {
				selectionTextStartsInNode = true;
			}
			if(lastNode === this.domNode || this.domNode.contains(lastNode)) {
				selectionTextEndsInNode = true;
			}

			// If the selection begins in the node but does not end in the node
			if(selectionTextStartsInNode && !selectionTextEndsInNode) {
				//app.log('The selection begins in the node but does not end in the node');
				selectionText = this.domNode.textContent.substring(firstNodeOffset);
			}
			// If the selection ends in the node but does not begin in it
			else if(!selectionTextStartsInNode && selectionTextEndsInNode) {
				//app.log('The selection ends in the node but does not begin in it');
				selectionText = this.domNode.textContent.substring(0, lastNodeOffset);
			}
			// If the selection begins and ends in the node
			else if(selectionTextStartsInNode && selectionTextEndsInNode) {
				//app.log('The selection begins and ends in the node');
				var selectionRange = selection.getRangeAt(0);
				selectionText = selectionRange.toString();
			}
			// If the selection does not begin or end in this node, then the entire node must be selected
			else {
				//app.log('The selection does not begin or end in this node, then the entire node is selected');
				selectionText = this.domNode.textContent;
			}
		}

        return selectionText;
    }

	getDimensions() {
		this.getDimensionAndPositionFromDomNode();

		return this.dimensions;
	}

	getPosition() {
		this.getDimensionAndPositionFromDomNode();

		return this.position;
	}

	getDimensionAndPositionFromDomNode() {
		if(this.domNode) {
			var boundingClientRect = this.domNode.getBoundingClientRect();

			// Dimensions
			this.dimensions.width = boundingClientRect.width;
			this.dimensions.height = boundingClientRect.height;

			// Position - relativeToRelativeAncestor
			this.position.relativeToRelativeAncestor.x = this.domNode.scrollTop;
			this.position.relativeToRelativeAncestor.y = this.domNode.scrollLeft;

			// Position - relativeToDocumentViewport
			this.position.relativeToDocumentViewport.x = boundingClientRect.left;
			this.position.relativeToDocumentViewport.y = boundingClientRect.top;

			this.position.relativeToDocumentViewport.coordinates.topLeft.x = boundingClientRect.left;
			this.position.relativeToDocumentViewport.coordinates.topLeft.y = boundingClientRect.top;
						
			this.position.relativeToDocumentViewport.coordinates.topCenter.x = boundingClientRect.width / 2;
			this.position.relativeToDocumentViewport.coordinates.topCenter.y = boundingClientRect.top;
						
			this.position.relativeToDocumentViewport.coordinates.topRight.x = boundingClientRect.right;
			this.position.relativeToDocumentViewport.coordinates.topRight.y = boundingClientRect.top;

			this.position.relativeToDocumentViewport.coordinates.leftCenter.x = boundingClientRect.left;
			this.position.relativeToDocumentViewport.coordinates.leftCenter.y = boundingClientRect.height / 2;

			this.position.relativeToDocumentViewport.coordinates.rightCenter.x = boundingClientRect.right;
			this.position.relativeToDocumentViewport.coordinates.rightCenter.y = boundingClientRect.height / 2;

			this.position.relativeToDocumentViewport.coordinates.bottomLeft.x = boundingClientRect.left;
			this.position.relativeToDocumentViewport.coordinates.bottomLeft.y = boundingClientRect.bottom;
						
			this.position.relativeToDocumentViewport.coordinates.bottomCenter.x = boundingClientRect.width / 2;
			this.position.relativeToDocumentViewport.coordinates.bottomCenter.y = boundingClientRect.bottom;
						
			this.position.relativeToDocumentViewport.coordinates.bottomRight.x = boundingClientRect.right;
			this.position.relativeToDocumentViewport.coordinates.bottomRight.y = boundingClientRect.bottom;

			this.position.relativeToDocumentViewport.coordinates.center.x = boundingClientRect.width / 2;
			this.position.relativeToDocumentViewport.coordinates.center.y = boundingClientRect.height / 2;

			this.position.relativeToDocumentViewport.edges = boundingClientRect.top;
			this.position.relativeToDocumentViewport.edges = boundingClientRect.right;
			this.position.relativeToDocumentViewport.edges = boundingClientRect.bottom;
			this.position.relativeToDocumentViewport.edges = boundingClientRect.left;
		}

		return {
			dimensions: this.dimensions,
			position: this.position,
		};
	}

	press() {
		if(this.domNode) {
			this.domNode.click();
		}
	}

	static is(value) {
		return Class.isInstance(value, HtmlNode);
	}

	static createDomNode = HtmlNode.prototype.createDomNode;

	static emptyDomNode = HtmlNode.prototype.emptyDomNode;

}

// Class implementations
Class.implement(HtmlNode, HtmlNodeEventEmitter);

// Export
export default HtmlNode;
