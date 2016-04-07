// Dependencies
var XmlNode = Framework.require('system/xml/XmlNode.js');
var PropagatingEventEmitter = Framework.require('system/events/PropagatingEventEmitter.js');
var HtmlEventsMap = Framework.require('system/html/HtmlEventsMap.js');

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
		//Console.log('HtmlNode.executeDomUpdate', this);

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

		this.emit('domUpdateExecuted');
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

	createDomFragment: function(htmlNode) {
		// Allow this method to be called statically
		if(!htmlNode) {
			htmlNode = this;
		}

		var domFragment = document.createRange().createContextualFragment(htmlNode.toString());

		return domFragment;
	},

	appendDomNode: function() {
		//Console.log('HtmlNode.appendDomNode');

		// Append the child DOM node to this node's DOM node
		this.parent.domNode.appendChild(this.createDomFragment());

		// Have the child reference the newly created DOM node
		this.domNode = this.parent.domNode.lastChild;

		this.mountedToDom();
	},

	replaceDomNode: function(indexOfChildDomNodeToReplace) {
		//Console.log('HtmlNode.replaceDomNode', indexOfChildDomNodeToReplace);

		// Replace the DOM node with the replacement fragment
		this.parent.domNode.replaceChild(this.createDomFragment(), this.parent.domNode.childNodes[indexOfChildDomNodeToReplace]);

		// Have the child reference the replaced DOM node
		this.domNode = this.parent.domNode.childNodes[indexOfChildDomNodeToReplace];

		this.mountedToDom();
	},

	mountedToDom: function() {
		//Console.log('mountedToDom', this);

		this.isMountedToDom = true;

		// Execute DOM updates if necessary
		this.executeDomUpdate();

		this.emit('mountedToDom');
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

	addEventListener: function(eventPattern, functionToBind, timesToRun) {
		//Console.log('HtmlNode.addEventListener', eventPattern);

		// If the event is for the domNode, add another event listener to the domNode to proxy the emit when the domNode emits
		if(HtmlEventsMap[eventPattern]) {
			// If the domNode already exists
			if(this.domNode) {
				this.domNode.addEventListener(HtmlEventsMap[eventPattern], function(event) {
					this.emit(eventPattern, event);
				}.bind(this));
			}
			// If we need to wait for the domNode to be mounted
			else {
				this.on('mountedToDom', function() {
					this.domNode.addEventListener(HtmlEventsMap[eventPattern], function(event) {
						this.emit(eventPattern, event);
					}.bind(this));
				}.bind(this));
			}
		}

		// Add the event listener as normal
		return EventEmitter.prototype.addEventListener.apply(this, arguments);
	},

});

// Static methods

HtmlNode.createDomFragment = HtmlNode.prototype.createDomFragment;

HtmlNode.emptyDomNode = HtmlNode.prototype.emptyDomNode;

HtmlNode.is = function(value) {
	return Class.isInstance(value, HtmlNode);
};

// Class implementations
HtmlNode.implement(PropagatingEventEmitter);

// Export
module.exports = HtmlNode;