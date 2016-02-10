// TODO: Is this super sketchy?
// HtmlElement inherits from both the XmlElement as well as HtmlNode

HtmlElement = XmlElement.extend({

	applyToDom: function() {
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
				var attributeValue = HtmlElement.attributeValueToString(this.attributes[domNodeAttribute.name]);

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
					value: HtmlElement.attributeValueToString(attributeValue),
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
		// TODO:
		// This seems like it is going to be slow and not good... will need to fix this

		// Keep track of how many DOM element children actually exist
		var domNodeChildNodesLength = this.domNode.childNodes.length;

		// Update the domNode's content, maintaining domNode references for each HtmlElement
		this.chidren.each(function(contentIndex, content) {
			var contentIsHtmlElement = Class.isInstance(content, HtmlElement);

			// Make sure we have a reference to htmlDocument, we may not if the child HtmlElement is created in the constructor of its parent HtmlElement
			if(contentIsHtmlElement && !content.htmlDocument) {
				content.htmlDocument = this.htmlDocument;
			}

			// If there is a corresponding child DOM element for the context index, we will do a comparison
			if(contentIndex < domNodeChildNodesLength) {
				var currentChildDomNode = this.domNode.childNodes[contentIndex];

				//console.log('Comparing to current domNode', 'currentChildDomNode', currentChildDomNode, 'content', content);

				// If the content's domNode matches the current child DOM element
				if(content.domNode === currentChildDomNode) {
					// Update the HtmlElement
					content.executeDomUpdate();
				}
				// If the current child DOM element does not match, we need to replace it
				else {
					// Create a new DOM element for the content
					var newChildDomNode = content.createDomNode();

					// Replace the old one
					this.domNode.replaceChild(newChildDomNode, currentChildDomNode);

					// Update the domNode reference for the child HtmlElement
					content.domNode = this.domNode.childNodes[contentIndex];

					// Mark the content as being added to the DOM
					content.addedToDom();
				}
			}
			// If there is no corresponding child DOM element for the current index, we will create one
			else {
				// Create the child DOM element
				var childDomNode = HtmlElement.createDomNode(content);

				// Append the child DOM element to this element's DOM element
				this.domNode.appendChild(childDomNode);

				// If we are adding an HtmlElement
				if(contentIsHtmlElement) {
					content.domNode = this.domNode.lastChild;
					content.addedToDom();
				}

				//console.log('Created new domNode', 'childDomNode', childDomNode, 'content', content);
			}
		}.bind(this));

		// If there are more child DOM elements than content, we must remove them
		if(domNodeChildNodesLength > this.chidren.length) {
			for(var i = this.chidren.length; i < domNodeChildNodesLength; i++) {
				this.domNode.removeChild(this.domNode.childNodes[contentIndex]);
			}
		}
	},

	on: function(eventName, callback) {
		if(this.domNode && this.domNode.addEventListener) {
			this.domNode.addEventListener(eventName, callback);
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

	setHeight: function(height) {
		this.setStyle('height', height+'px');

		return this;
	},

	setWidth: function(width) {
		this.setStyle('width', width+'px');

		return this;
	},

	focus: function() {
		console.log('.focus()', this);

		if(this.domNode) {
			this.domNode.focus();	
		}

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

	setAttribute: function(attributeName, attributeValue) {
		this.super.apply(this, arguments);

		this.updateDom();

		return this;
	},

	removeAttribute: function(attributeName) {
		this.super.apply(this, arguments);

		this.updateDom();

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

	setContent: function(content) {
		//console.log('setContent');

		this.chidren = Array.wrap(content);
		this.updateDom();

		return this;
	},

	append: function(stringOrElement) {
		this.super.apply(this, arguments);

		this.processChild(stringOrElement);

		this.updateDom();

		return this;
	},

	prepend: function(stringOrElement) {
		this.super.apply(this, arguments);

		this.processChild(stringOrElement);

		this.updateDom();

		return this;
	},

	prepend: function(stringOrHtmlNode) {
		this.children.prepend(HtmlNode.makeHtmlNode(stringOrHtmlNode, this));

		return this;
	},	

	append: function(stringOrHtmlNode) {
		this.children.append(HtmlNode.makeHtmlNode(stringOrHtmlNode, this));

		return this;
	},

	empty: function() {
		this.super.apply(this, arguments);
		this.updateDom();

		return this;
	},

});

// Static methods
HtmlElement.is = function(value) {
	return Class.isInstance(value, HtmlElement);
}