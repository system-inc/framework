HtmlElement = XmlElement.extend({

	identifier: '0', // Used to uniquely identify HtmlElements for tree comparisons againt the DOM
	identifierCounter: 0, // Used to ensure unique identifiers

	htmlDocument: null,

	domElement: null,
	shouldExecuteDomUpdate: false, // Keep track of whether or not the HtmlElement is different from the DOM

	// This method assumes this.domElement is set already
	addToDom: function() {
		// Run execute DOM update to sync with the DOM
		this.executeDomUpdate();

		// Call addedToDom
		this.addedToDom();
	},

	addedToDom: function() {
		//console.log('HtmlElement.addedToDom', this);
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
		// Don't do anything if we don't have a domElement
		else if(!this.domElement) {
			//Console.warn('Unable to updateDom, HtmlElement is missing the domElement property.', this);
		}
		// Register an update with the HtmlDocument
		else {
			this.htmlDocument.updateDom(this);
		}
	},

	// Apply the current state of this HtmlElement to the DOM
	executeDomUpdate: function() {
		//console.log('executeDomUpdate', this);

		// TODO:
		// Because the virtual DOM is the state of truth, can we just keep track of all changes
		// on HtmlElement and then loop through and apply them? This would be more performant than
		// reading all of the attributes on the DOM and comparing them

		if(this.shouldExecuteDomUpdate) {
			// Update the DOM element's attributes
			this.updateDomElementAttributes();

			// Update the DOM element's content
			this.updateDomElementContent();

			// Mark the object as clean
			this.shouldExecuteDomUpdate = false;
		}
		else {
			//console.info('No need to run updates on this element', this);
		}
	},

	updateDomElementAttributes: function() {
		//console.log('updateDomElementAttributes', this.tag, Json.encode(this.attributes));

		var domElementAttributesToUpdate = {};
		var domElementAttributeNames = {};

		// Loop through all of the DOM element's attributes
		this.domElement.attributes.each(function(domElementAttributeIndex, domElementAttribute) {
			//console.log(domElementAttributeIndex, domElementAttribute, domElementAttribute.name, domElementAttribute.value);

			// Keep track of all DOM element attribute names so we know later on if we need to add anything
			domElementAttributeNames[domElementAttribute.name] = true;

			// If the DOM element attribute still exists on the HtmlElement we need to check if they still match
			if(this.attributes[domElementAttribute.name] !== undefined) {
				var attributeValue = HtmlElement.attributeValueToString(this.attributes[domElementAttribute.name]);

				// If they do not match, mark the attribute to be updated
				if(attributeValue != domElementAttribute.value) {
					domElementAttributesToUpdate[domElementAttribute.name] = {
						value: attributeValue,
						action: 'set',
					};
				}
			}
			// If the DOM element attribute does not exist on the HtmlElement anymore, mark it for removal
			else {
				domElementAttributesToUpdate[domElementAttribute.name] = {
					action: 'remove',
				};
			}
		}.bind(this));

		// Loop through all of the HtmlElement's attributes looking to see if we have any new attributes to set
		this.attributes.each(function(attributeName, attributeValue) {
			// If the attribute does not exist in domElementAttributesToUpdate, then we must set it
			if(domElementAttributeNames[attributeName] === undefined) {
				domElementAttributesToUpdate[attributeName] = {
					value: HtmlElement.attributeValueToString(attributeValue),
					action: 'set',
				};
			}
		}.bind(this));

		//console.log('domElementAttributesToUpdate', domElementAttributesToUpdate);

		// Update the DOM element's attributes
		domElementAttributesToUpdate.each(function(domElementAttributeToUpdateName, domElementAttributeToUpdate) {
			if(domElementAttributeToUpdate.action == 'remove') {
				//console.log('removeAttribute', domElementAttributeToUpdateName);
				this.domElement.removeAttribute(domElementAttributeToUpdateName);
			}
			else if(domElementAttributeToUpdate.action == 'set') {
				//console.log('setAttribute', domElementAttributeToUpdateName, domElementAttributeToUpdate.value);
				this.domElement.setAttribute(domElementAttributeToUpdateName, domElementAttributeToUpdate.value);
			}
		}.bind(this));
	},

	updateDomElementContent: function() {
		// TODO:
		// This seems like it is going to be slow and not good... will need to fix this

		// Keep track of how many DOM element children actually exist
		var domElementChildNodesLength = this.domElement.childNodes.length;

		// Update the domElement's content, maintaining domElement references for each HtmlElement
		this.content.each(function(contentIndex, content) {
			// If there is a corresponding child DOM element for the context index, we will do a comparison
			if(contentIndex < domElementChildNodesLength) {
				var currentChildDomElement = this.domElement.childNodes[contentIndex];

				//console.log('Comparing to current domElement', 'currentChildDomElement', currentChildDomElement, 'content', content);

				// If we are working with an HtmlElement
				if(Class.isInstance(content, HtmlElement)) {
					// If the content's domElement matches the current child DOM element
					if(content.domElement === currentChildDomElement) {
						// Update the HtmlElement
						content.executeDomUpdate();
					}
					// If the current child DOM element does not match, we need to replace it
					else {
						// Create a new DOM element for the content
						var newChildDomElement = content.createDomElement();

						// Replace the old one
						this.domElement.replaceChild(newChildDomElement, currentChildDomElement);

						// Update the domElement reference for the child HtmlElement
						content.domElement = this.domElement.childNodes[contentIndex];

						// Mark the content as being added to the DOM
						content.addedToDom();
					}					
				}
				// If the content is not an HtmlElement, it must be string
				else {
					//console.log('Comparing to current domElement', 'currentChildDomElement', currentChildDomElement, currentChildDomElement.nodeValue, 'content', content);
					
					// If we have any DOM node type that is not an element
					if(currentChildDomElement.nodeType != 1) {
						// Make sure the string matches
						// Must use nodeValue here because innerHTML does not exist on DOM nodes which just have text
						if(content != currentChildDomElement.nodeValue) {
							currentChildDomElement.nodeValue = content;
						}
					}
					// We have a DOM node which is an element, so we use innerHTML
					else {
						// Make sure the string matches
						if(content != currentChildDomElement.innerHTML) {
							currentChildDomElement.innerHTML = content;
						}
					}
				}
			}
			// If there is no corresponding child DOM element for the current index, we will create one
			else {
				// Create the child DOM element
				var childDomElement = HtmlElement.createDomElement(content);

				// Append the child DOM element to this element's DOM element
				this.domElement.appendChild(childDomElement);

				// If we are adding an HtmlElement
				if(Class.isInstance(content, HtmlElement)) {
					content.domElement = this.domElement.lastChild;
					content.addedToDom();
				}

				//console.log('Created new domElement', 'childDomElement', childDomElement, 'content', content);
			}
		}.bind(this));

		// If there are more child DOM elements than content, we must remove them
		if(this.content.length > domElementChildNodesLength) {
			for(var i = this.content.length; i < domElementChildNodesLength; i++) {
				this.domElement.removeChild(this.domElement.childNodes[contentIndex]);
			}
		}
	},

	emptyDomElement: function(domElement) {
		if(!domElement) {
			domElement = this.domElement;
		}

		while(domElement.firstChild) {
			domElement.removeChild(domElement.firstChild);
		}

		return domElement;
	},

	createDomElement: function(content) {
		// Allow this method to be called statically
		if(!content) {
			content = this;
		}

		var domElement = document.createRange().createContextualFragment(content);

		return domElement;
	},

	on: function(eventName, callback) {
		if(this.domElement && this.domElement.addEventListener) {
			this.domElement.addEventListener(eventName, callback);
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
		if(this.domElement) {
			this.domElement.focus();	
		}

		return this;
	},

	show: function() {
		//console.log('show');
		this.setStyle('display', 'block');

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

		this.content = Array.wrap(content);
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

	processChild: function(stringOrElement) {
		// Handle HtmlElement objects
		if(Class.isInstance(stringOrElement, HtmlElement)) {
			// Set a reference to the htmlDocument
			stringOrElement.htmlDocument = this.htmlDocument;

			// Set the identifier on the HtmlElement
			stringOrElement.identifier = stringOrElement.parent.identifier+'.'+this.identifierCounter;

			// Set the identifier on the domElement
			//stringOrElement.setAttribute('data-identifier', stringOrElement.identifier);

			// Increment the identifier counter
			this.identifierCounter++;
		}
	},

	empty: function() {
		this.super.apply(this, arguments);
		this.updateDom();

		return this;
	},

	clone: function(options) {
		options = {
			content: true,
		}.merge(options);

		// Create a new HtmlElement
		var htmlElement = new HtmlElement(this.tag, null, this.unary);

		// Link the htmlDocument
		htmlElement.htmlDocument = this.htmlDocument;

		// Link the domElement
		htmlElement.domElement = this.domElement;

		// Clone the attributes
		htmlElement.attributes = Object.clone(this.attributes);

		// Conditionally clone the content
		if(options.content) {
			this.content.each(function(index, stringOrElement) {
				var content;

				// Bring primitives over, no need to clone
				if(Primitive.is(stringOrElement)) {
					content = stringOrElement;
				}
				// Clone anything else
				else {
					content = stringOrElement.clone();
				}

				htmlElement.content.append(content);
			});
		}

		return htmlElement;
	},

});

// Static methods
HtmlElement.emptyDomElement = HtmlElement.prototype.emptyDomElement;
HtmlElement.createDomElement = HtmlElement.prototype.createDomElement;