HtmlElement = HtmlNode.extend({

	// HtmlElement cannot be a subclass of both XmlElement and HtmlNode
	// So, we will extend from HtmlNode and reference the properties and methods we want from XmlElement
	// As a consequence, instanceof XmlElement will not return true for objects of type HtmlElement

	// XmlNode properties
	type: XmlElement.prototype.type,

	// XmlElement properties
	tag: XmlElement.prototype.tag,
	unary: XmlElement.prototype.unary, // Tags are not unary (self-closing) by default
	attributes: XmlElement.prototype.attributes,
	children: XmlElement.prototype.children, // Array containing strings or elements

	// XmlElement methods
	getAttribute: XmlElement.prototype.getAttribute,
	//setAttribute: XmlElement.prototype.setAttribute,
	//removeAttribute: XmlElement.prototype.removeAttribute,
	//empty: XmlElement.prototype.empty,
	//prepend: XmlElement.prototype.prepend,
	//append: XmlElement.prototype.append,
	tagOpeningToString: XmlElement.prototype.tagOpeningToString,
	tagClosingToString: XmlElement.prototype.tagClosingToString,
	tagToString: XmlElement.prototype.tagToString,
	childrenToString: XmlElement.prototype.childrenToString,
	toString: XmlElement.prototype.toString,

	// Uses XmlElement
	construct: function() {
		// Use XmlElement's constructor
		XmlElement.prototype.construct.apply(this, arguments);
	},

	// Method exists on XmlElement as well
	setAttribute: function(attributeName, attributeValue) {
		XmlElement.prototype.setAttribute.apply(this, arguments);

		this.updateDom();

		return this;
	},

	// Method exists on XmlElement as well
	removeAttribute: function(attributeName) {
		XmlElement.prototype.removeAttribute.apply(this, arguments);

		this.updateDom();

		return this;
	},

	// Method exists on XmlElement as well
	empty: function() {
		XmlElement.prototype.empty.apply(this, arguments);

		this.updateDom();

		return this;
	},

	// Method exists on XmlElement as well
	prepend: function(stringOrHtmlNode) {
		this.children.prepend(HtmlElement.makeHtmlNode(stringOrHtmlNode, this));

		this.updateDom();

		return this;
	},

	// Method exists on XmlElement as well
	append: function(stringOrHtmlNode) {
		this.children.append(HtmlElement.makeHtmlNode(stringOrHtmlNode, this));

		this.updateDom();

		return this;
	},

	setContent: function(content) {
		// Empty the current content
		this.empty();

		// Append the new content
		this.append(content);
	},

	descendFromParent: function(parent) {
		// Use HtmlNode's method
		this.super.apply(this, arguments);

		// Add a DOM attribute for testing
		this.setAttribute('data-identifier', this.identifier);

		// Reset the identifierCounter
		this.identifierCounter = 0;

		// Recurse through all children to make sure they descend
		this.children.each(function(childIndex, child) {
			child.descendFromParent(this);
		}.bind(this));
	},

	applyDomUpdates: function() {
		// Update the DOM element's attributes
		this.updateDomNodeAttributes();

		// Update the DOM element's children
		this.updateDomNodeChildren();
	},

	updateDomNodeAttributes: function() {
		//console.log('updateDomNodeAttributes', this.tag, Json.encode(this.attributes));

		// TODO:
		// Because the virtual DOM is the state of truth, can we just keep track of all changes
		// on HtmlElement and then loop through and apply them? This would be more performant than
		// reading all of the attributes on the DOM and comparing them

		var domNodeAttributesToUpdate = {};
		var domNodeAttributeNames = {};

		// Loop through all of the DOM element's attributes
		this.domNode.attributes.each(function(domNodeAttributeIndex, domNodeAttribute) {
			//console.log(domNodeAttributeIndex, domNodeAttribute, domNodeAttribute.name, domNodeAttribute.value);

			// Keep track of all DOM element attribute names so we know later on if we need to add anything
			domNodeAttributeNames[domNodeAttribute.name] = true;

			// If the DOM element attribute still exists on the HtmlElement we need to check if they still match
			if(this.attributes[domNodeAttribute.name] !== undefined) {
				var attributeValue = XmlElement.attributeValueToString(this.attributes[domNodeAttribute.name]);

				// If they do not match, mark the attribute to be updated
				if(attributeValue != domNodeAttribute.value) {
					domNodeAttributesToUpdate[domNodeAttribute.name] = {
						value: attributeValue,
						action: 'set',
					};
				}
			}
			// If the DOM element attribute does not exist on the HtmlElement anymore, mark it for removal
			else {
				domNodeAttributesToUpdate[domNodeAttribute.name] = {
					action: 'remove',
				};
			}
		}.bind(this));

		// Loop through all of the HtmlElement's attributes looking to see if we have any new attributes to set
		this.attributes.each(function(attributeName, attributeValue) {
			// If the attribute does not exist in domNodeAttributesToUpdate, then we must set it
			if(domNodeAttributeNames[attributeName] === undefined) {
				domNodeAttributesToUpdate[attributeName] = {
					value: XmlElement.attributeValueToString(attributeValue),
					action: 'set',
				};
			}
		}.bind(this));

		//console.log('domNodeAttributesToUpdate', domNodeAttributesToUpdate);

		// Update the DOM element's attributes
		domNodeAttributesToUpdate.each(function(domNodeAttributeToUpdateName, domNodeAttributeToUpdate) {
			if(domNodeAttributeToUpdate.action == 'remove') {
				//console.log('removeAttribute', domNodeAttributeToUpdateName);
				this.domNode.removeAttribute(domNodeAttributeToUpdateName);
			}
			else if(domNodeAttributeToUpdate.action == 'set') {
				//console.log('setAttribute', domNodeAttributeToUpdateName, domNodeAttributeToUpdate.value);
				this.domNode.setAttribute(domNodeAttributeToUpdateName, domNodeAttributeToUpdate.value);
			}
		}.bind(this));
	},

	updateDomNodeChildren: function() {
		// TODO: do I need to do this if I am already mounted to the DOM? each of my children should register changes if necessary
		// which means I do not need to loop through them

		// TODO:
		// This seems like it is going to be slow and not good... will need to fix this

		// Keep track of how many DOM node children actually exist
		var domNodeChildNodesLength = this.domNode.childNodes.length;

		// Update the domNode's children, maintaining domNode references for each HtmlNode
		this.children.each(function(childIndex, child) {
			// If there is a corresponding child DOM node for the childIndex, we will do a comparison
			if(childIndex < domNodeChildNodesLength) {
				var currentChildDomNode = this.domNode.childNodes[childIndex];

				//console.log('Comparing to current domNode', 'currentChildDomNode', currentChildDomNode, 'child', child);

				// If the child's domNode matches the current child DOM node
				if(child.domNode === currentChildDomNode) {
					// Call executeDomUpdate which will update the DOM node if necessary
					child.executeDomUpdate();
				}
				// If the current child DOM node does not match, we need to replace it
				else {
					child.replaceDomNode(childIndex);
				}
			}
			// If there is no corresponding child DOM node for the current index, we will create one
			else {
				child.appendDomNode();
			}
		}.bind(this));

		// If there are more child DOM elements than child, we must remove them
		for(var i = this.children.length; i < domNodeChildNodesLength; i++) {
			this.domNode.removeChild(this.domNode.childNodes[childIndex]);
		}
	},

	createDomFragment: function(htmlElement) {
		// Allow this method to be called statically
		if(!htmlElement) {
			htmlElement = this;
		}

		// The DOM fragment is just for the tag, not for the children
		var domFragment = document.createRange().createContextualFragment(htmlElement.tagToString());
		//var domFragment = document.createRange().createContextualFragment(htmlElement);

		return domFragment;
	},

	on: function(eventName, callback) {
		if(this.domNode) {
			this.domNode.addEventListener(eventName, callback);
		}
		else {
			this.afterMountedToDom(function() {
				//console.log('this.afterMountedToDom addEventListener');
				this.domNode.addEventListener(eventName, callback);
			}.bind(this));
		}

		return this;
	},

	addClass: function(className) {
		var classAttributeValue = this.getAttribute('class');
		var classes = [];

		// If there is no class attribute, create one and set it to the class
		if(!classAttributeValue) {
			classes.append(className);
		}
		// If there is a class attribute value
		else {
			classes = classAttributeValue.split(' ')

			// If the class isn't already in there, add it
			if(!classes.contains(className)) {
				classes.append(className);
			}
		}

		this.setAttribute('class', classes.join(' '));

		return this;
	},

	removeClass: function(className) {
		var classAttributeValue = this.getAttribute('class');

		if(classAttributeValue) {
			var classes = classAttributeValue.split(' ');
			classes.deleteValue(className);

			this.setAttribute('class', classes.join(' '));
		}

		return this;
	},

	setStyle: function(property, value) {
		if(!this.attributes.style) {
			this.attributes.style = {};
		}

		this.attributes.style[property] = value;
		this.updateDom();

		return this;
	},

	setHeight: function(height) {
		this.setStyle('height', height+'px');

		return this;
	},

	setWidth: function(width) {
		this.setStyle('width', width+'px');

		return this;
	},

	show: function() {
		//console.log('show');
		this.setStyle('display', 'flex');

		return this;
	},

	hide: function() {
		//console.log('hide');
		this.setStyle('display', 'none');

		return this;
	},

    focus: function() {        
        // Remember, this.domNode must be visible on the screen to be focused, so if the virtual DOM is scheduled to show this.domNode but it hasn't updated yet, this call will not work
        if(this.domNode) {
            this.domNode.focus();
        }

        return this;
    },

});

// Static methods
HtmlElement.createDomFragment = HtmlElement.prototype.createDomFragment;

HtmlElement.makeHtmlNode = function(value, parent, type) {
	var alreadyIsHtmlNode = HtmlNode.is(value);

	// If the value is currently not of type HtmlNode (it must be a string), turn it into an HtmlNode
	if(!alreadyIsHtmlNode) {
		value = new HtmlNode(value, parent, type);
	}
	// If the value is already an HtmlNode, make sure it inherits traits from the parent 
	else {
		value.descendFromParent(parent);
	}

	return value;
}

HtmlElement.is = function(value) {
	return Class.isInstance(value, HtmlElement);
}