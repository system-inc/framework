HtmlNode = XmlNode.extend({

	htmlDocument: null,

	domNode: null,
	shouldExecuteDomUpdate: false, // Keep track of whether or not the HtmlElement is different from the DOM

	identifier: null, // Used to uniquely identify HtmlNodes for tree comparisons againt the DOM
	identifierCounter: 0, // Used to ensure unique identifiers

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
			if(this.parent.identifier === null) {
				this.parent.identifier = '0';
			}

			// Set the identifier
			this.identifier = this.parent.identifier+'.'+this.identifierCounter;

			// Increment the identifier counter
			this.identifierCounter++;
		}
	},

	// Called whenever the HtmlElement changes
	updateDom: function() {
		//console.log('HtmlElement.updateDom()');

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
		//console.log('HtmlNode.executeDomUpdate', this);

		// If we should execute an update
		if(this.shouldExecuteDomUpdate) {
			// Apply the current state to the DOM
			this.applyToDom();

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
	},

	applyToDom: function() {
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

	createDomNode: function(content) {
		// Allow this method to be called statically
		if(!content) {
			content = this;
		}

		console.error('document fragments do not track when they are actually added to the DOM, so references to them are pointless')

		var domNode;
		if(Class.isInstance(content, HtmlElement)) {
			domNode = document.createRange().createContextualFragment(content.tagToString());
		}
		else {
			domNode = document.createRange().createContextualFragment(content);
		}
		content.domNode = domNode;

		if(Class.isInstance(content, HtmlElement)) {
			// Loop through the children of the child and create DOM
			content.content.each(function(currentChildIndex, currentChild) {
				var childDomNode = HtmlElement.createDomNode(currentChild);

				if(Class.isInstance(currentChild, HtmlElement)) {
					currentChild.domNode = childDomNode;
				}

				content.domNode.appendChild(childDomNode);
			});
		}

		console.error(content);

		return domNode;
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

});

// Static methods
HtmlNode.createDomNode = HtmlNode.prototype.createDomNode;
HtmlNode.emptyDomNode = HtmlNode.prototype.emptyDomNode;

HtmlNode.is = function(value) {
	return Class.isInstance(value, HtmlNode);
}

HtmlNode.makeHtmlNode = function(value, parent, type) {
	// If the value is currently not of type HtmlNode, make turn it into an HtmlNode
	if(!HtmlNode.is(value)) {
		value = new HtmlNode(value, parent, type);
	}

	return value;
}