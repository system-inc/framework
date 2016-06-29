// Dependencies
var XmlNode = Framework.require('system/xml/XmlNode.js');
var HtmlNodeEventEmitter = Framework.require('system/html/events/HtmlNodeEventEmitter.js');

// Class
var HtmlNode = XmlNode.extend({

	htmlDocument: null,

	domNode: null,
	isMountedToDom: false,
	shouldExecuteDomUpdate: false, // Keep track of whether or not the HtmlElement is different from the DOM

	nodeIdentifier: null, // Used to uniquely identify HtmlNodes for tree comparisons againt the DOM
	nodeIdentifierCounter: 0, // Used to ensure unique identifiers

	construct: function(content, parent, type) {
		this.super.apply(this, arguments);

		this.descendFromParent();
	},

	descendFromParent: function(parent) {
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
	},

	// Called whenever the HtmlNode changes
	updateDom: function() {
		//Console.log('HtmlNode.updateDom()');

		// Mark the object as dirty
		this.shouldExecuteDomUpdate = true;

		// Don't do anything if we aren't connected to the DOM
		if(!this.htmlDocument) {
			//Console.warn('Unable to updateDom, HtmlElement is missing the htmlDocument property.', this);
		}
		// Don't do anything if we don't have a domNode
		else if(!this.domNode) {
			//Console.warn('Unable to updateDom, HtmlElement is missing the domNode property.', this);
		}
		// Register an update with the HtmlDocument
		else {
			this.htmlDocument.updateDom(this);
		}
	},

	executeDomUpdate: function() {
		//Console.log('HtmlNode executeDomUpdate', this.tag);

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
	},

	domUpdateExecuted: function() {
		// Mark the object as clean
		this.shouldExecuteDomUpdate = false;

		this.emit('htmlNode.domUpdateExecuted', this, {
			propagationStopped: true, // Do not propagate this event
		});
	},

	applyDomUpdates: function() {
		// Update the DOM node's value
		this.updateDomNodeValue();
	},

	updateDomNodeValue: function() {
		// Make sure the string matches
		if(this.value != this.domNode.nodeValue) {
			// Must use nodeValue here because innerHTML does not exist on DOM nodes which just have text
			this.domNode.nodeValue = this.value;
		}
	},

	createDomNode: function(htmlNode) {
		// Allow this method to be called statically
		if(!htmlNode) {
			htmlNode = this;
		}

		var domFragment = document.createRange().createContextualFragment(htmlNode.toString());
		//Console.log('HtmlNode domFragment for', htmlNode.tag, domFragment);

		return domFragment;
	},

	appendDomNode: function() {
		//Console.log('HtmlNode.appendDomNode', this.tag);

		var domFragment = this.createDomNode();

		//Console.standardLog('this.parent.domNode', this.parent.domNode);

		// Append the child DOM node to this node's DOM node
		var appendedNode = this.parent.domNode.appendChild(domFragment);

		// Have the child reference the newly created DOM node
		this.domNode = this.parent.domNode.lastChild;

		//Console.standardLog('this.domNode', this.domNode);

		this.mountedToDom();
	},

	replaceDomNode: function(indexOfChildDomNodeToReplace) {
		//Console.log('HtmlNode.replaceDomNode', indexOfChildDomNodeToReplace, this.tag);

		var domFragment = this.createDomNode();

		// Replace the DOM node with the replacement fragment
		this.parent.domNode.replaceChild(domFragment, this.parent.domNode.childNodes[indexOfChildDomNodeToReplace]);

		// Have the child reference the replaced DOM node
		this.domNode = this.parent.domNode.childNodes[indexOfChildDomNodeToReplace];

		this.mountedToDom();
	},

	mountedToDom: function() {
		//Console.log('HtmlNode mountedToDom', this.tag)

		this.isMountedToDom = true;

		// Execute DOM updates if necessary
		this.executeDomUpdate();

		this.emit('htmlNode.mountedToDom', this, {
			propagationStopped: true, // Do not propagate this event
		});
	},

	emptyDomNode: function(domNode) {
		if(!domNode) {
			domNode = this.domNode;
		}

		while(domNode.firstChild) {
			domNode.removeChild(domNode.firstChild);
		}

		return domNode;
	},

	getPosition: function(relativeToElement) {
		var position = null;

		// TODO: Implement relativeToElement, dy default the position is relative to the document

		if(this.domNode) {
			var boundingClientRect = this.domNode.getBoundingClientRect();

			position = {
				top: boundingClientRect.top,
				right: boundingClientRect.right,
				bottom: boundingClientRect.bottom,
				left: boundingClientRect.left,
				width: boundingClientRect.width,
				height: boundingClientRect.height,
				centerX: boundingClientRect.width / 2,
				centerY: boundingClientRect.height / 2,
			};
		}

		return position;
	},

	click: function() {
		if(this.domNode) {
			this.domNode.click();
		}
	},

});

// Static methods

HtmlNode.is = function(value) {
	return Class.isInstance(value, HtmlNode);
};

HtmlNode.createDomNode = HtmlNode.prototype.createDomNode;

HtmlNode.emptyDomNode = HtmlNode.prototype.emptyDomNode;

// Class implementations
HtmlNode.implement(HtmlNodeEventEmitter);

// Export
module.exports = HtmlNode;