// Dependencies
import XmlNode from 'framework/system/xml/XmlNode.js';
import HtmlNodeEventEmitter from 'framework/system/interface/graphical/web/html/events/html-node/HtmlNodeEventEmitter.js';
import HtmlNodeEvent from 'framework/system/interface/graphical/web/html/events/html-node/HtmlNodeEvent.js';
import Dimensions from 'framework/system/interface/graphical/Dimensions.js';
import Position from 'framework/system/interface/graphical/Position.js';

// Class (implements HtmlNodeEventEmitter)
class HtmlNode extends XmlNode {

	// HtmlNodeEventEmitter
	eventClass = HtmlNodeEvent;

	// HtmlEvent
	eventListenersOnDomObject = {};

	// PropagatingEventEmitter
	eventListeners = [];

	htmlDocument = null; // The HtmlDocument the HtmlNode is attached to
	domNode = null; // The native DOM node for this HtmlNode
	shouldExecuteDomUpdate = false; // Keep track of whether or not the HtmlElement is different from the DOM

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

	setParent(parent) {
		super.setParent(parent);

		// Set a reference to the parent's htmlDocument
		this.htmlDocument = this.parent.htmlDocument;
	}

	orphan() {
		// Use XmlNode's method to separate from the parent
		super.orphan();

		// Detach from the DOM
		this.detach();

		return this;
	}

	detach() {
		// Detach from the dom
		this.domNode.remove();
		this.unmountedFromDom();

		return this;
	}

	setContent(content) {
		this.content = content;

		this.render();

		return this;
	}

	beforeRender() {
	}

	render() {
		this.beforeRender();

		// Mark the object as dirty
		this.shouldExecuteDomUpdate = true;

		// Don't do anything if we aren't connected to the DOM
		if(!this.htmlDocument) {
			//app.info('Skipping render, HtmlNode is not connected to the DOM yet (missing the .htmlDocument property)', this);
		}
		// Don't do anything if we don't have a domNode
		else if(!this.domNode) {
			//app.info('Skipping render, HtmlNode is not initialized yet (missing the .domNode property)', this);
		}
		// Register a render task with the HtmlDocument
		else {
			//app.log('htmlNode.render()', this);
			this.htmlDocument.render(this);
		}
	}

	press() {
		if(this.domNode) {
			this.domNode.click();
		}
	}

	// TODO: At some point add some arguments to this function to allow it to specify the start and end offsets of the selection
	select() {
		var selection = this.htmlDocument.getSelection();
        var range = this.htmlDocument.domDocument.createRange();
        range.selectNodeContents(this.domNode);
        //console.log(selection, range);
        selection.removeAllRanges();
        selection.addRange(range);
	}

	getSelectionText() {
		var selectionText = null;

		// Get the selection from the document
		var selection = this.htmlDocument.getSelection();

		// If the node is part of the selection
		if(selection.containsNode(this.domNode, true)) {
			//console.log('selection contains node', selection);

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

    setSelectionRange() {
    	return this.domNode.setSelectionRange(...arguments);
    }

	calculateDimensionsAndPosition() {
		var dimensionsAndPosition = {
			dimensions: new Dimensions(),
			position: {
				relativeToDocument: new Position(),
				relativeToDocumentViewport: new Position(),
				relativeToDisplay: new Position(),
				relativeToAllDisplays: new Position(),
				relativeToPreviousAllDisplaysRelativePosition: new Position(),
				relativeToRelativeAncestor: new Position(),
			},
		};
		//return dimensionsAndPosition;

		if(this.domNode) {
			var boundingClientRect = this.domNode.getBoundingClientRect();
			//console.info('boundingClientRect', boundingClientRect);

			// Dimensions
			dimensionsAndPosition.dimensions.width = boundingClientRect.width;
			dimensionsAndPosition.dimensions.height = boundingClientRect.height;

			// Position - relativeToDocument
			// TODO
			
			// Position - relativeToDocumentViewport
			dimensionsAndPosition.position.relativeToDocumentViewport.x = boundingClientRect.left;
			dimensionsAndPosition.position.relativeToDocumentViewport.y = boundingClientRect.top;
			dimensionsAndPosition.position.relativeToDocumentViewport.calculateCoordinatesAndEdges(boundingClientRect.width, boundingClientRect.height);

			// Position - relativeToDisplay
			// TODO

			// Position - relativeToAllDisplays
			// TODO

			// Position - relativeToPreviousAllDisplaysRelativePosition
			// TODO

			// Position - relativeToRelativeAncestor
			dimensionsAndPosition.position.relativeToRelativeAncestor.x = this.domNode.scrollLeft;
			dimensionsAndPosition.position.relativeToRelativeAncestor.y = this.domNode.scrollTop;
			dimensionsAndPosition.position.relativeToDocumentViewport.calculateCoordinatesAndEdges(dimensionsAndPosition.dimensions.width, dimensionsAndPosition.dimensions.height);
		}

		return dimensionsAndPosition;
	}

	executeDomUpdate() {
		//app.log('htmlNode.executeDomUpdate()', this.tag, this);

		// If we should execute an update
		if(this.shouldExecuteDomUpdate) {
			//console.info('Need to run updates on this element', this.domNode, this);

			// Apply the current state to the DOM
			this.applyDomUpdates();

			// Mark the update as complete
			this.domUpdateExecuted();
		}
		else {
			//console.info('No need to run updates on this element', this.domNode, this);
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
		console.log('comparing this.content', this.content, 'to this.domNode.nodeValue', this.domNode.nodeValue);

		// Make sure the string matches
		if(this.content != this.domNode.nodeValue) {
			console.error('the content does not match');

			// Must use nodeValue here because innerHTML does not exist on DOM nodes which just have text
			this.domNode.nodeValue = this.content;
		}
	}

	appendDomNode() {
		//app.log('HtmlNode.appendDomNode', this);

		var domFragment = this.createDomNode(this);

		// Append the child DOM node to this node's DOM node
		var appendedNode = this.parent.domNode.appendChild(domFragment);

		// Have the child reference the newly created DOM node
		this.domNode = this.parent.domNode.lastChild;

		//console.log('this.domNode', this.domNode);

		this.mountedToDom();
	}

	replaceDomNode(indexOfChildDomNodeToReplace) {
		var domFragment = this.createDomNode(this);

		app.log('HtmlNode.replaceDomNode replacing', this.parent.domNode.childNodes[indexOfChildDomNodeToReplace], 'with', domFragment);

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

		// Execute DOM updates if necessary
		this.executeDomUpdate();

		this.emit('htmlNode.mountedToDom', this, {
			propagationStopped: true, // Do not propagate this event
		});
	}

	unmountedFromDom() {
		this.htmlDocument = null;
	}

	createDomNode() {
		return HtmlNode.createDomNode(this);
	}

	emptyDomNode() {
		//console.info('htmlNode.emptyDomNode', this);

		return HtmlNode.emptyDomNode(this.domNode);
	}

	static createDomNode(htmlNode) {
		// It is important that we create a text node here and not parse any HTML tags as all nodes must be created programmatically
		// If we parse HTML tags this will create new DOM nodes which the virtual DOM (HtmlDocument, HtmlElement, HtmlNode) will not be aware of
		// This is also a performance gain
		var domNode = document.createTextNode(htmlNode.toString());

		return domNode;
	}

	static emptyDomNode(domNode) {
		// while(domNode.firstChild) {
		// 	domNode.removeChild(domNode.lastChild); // Removing the last child is faster
		// }

		for(var i = domNode.childNodes.length - 1; i >= 0; i--) {
			domNode.removeChild(domNode.childNodes[i]);
		}

		console.log('domNode.childNodes.length', domNode.childNodes.length);

		return domNode;
	}

	static makeHtmlNode(value, parent, type) {
		if(value === null || value === undefined) {
			throw new Error('HtmlNodes may not be created from from null or undefined values.');
		}

		// If the value is currently not of type HtmlNode (it must be a string), turn it into an HtmlNode
		if(!HtmlNode.is(value)) {
			// if(value.contains('<')) {
			// 	app.warn('HTML strings are not supported (I should implement), use View or HtmlElement or HtmlNode.', value);
			// }
			value = new HtmlNode(value, parent, type);
		}

		return value;
	}

	static is(value) {
		return Class.isInstance(value, HtmlNode);
	}

}

// Class implementations
Class.implement(HtmlNode, HtmlNodeEventEmitter);

// Export
export default HtmlNode;
