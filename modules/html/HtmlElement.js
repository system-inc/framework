HtmlElement = XmlElement.extend({

	identifier: '0', // Used to uniquely identify HtmlElements for tree comparisons againt the DOM
	identifierCounter: 0, // Used to ensure unique identifiers

	domElement: null,

	domUpdateScheduled: false,
	domUpdates: {},

	addToDom: function() {
		// "this.domElement" is either be document.head or document.body
		if(this.domElement) {
			// Immediately update the DOM
			this.executeDomUpdate();
			this.addedToDom();
		}
	},

	addedToDom: function() {
		//console.log('----------- HtmlElement added to DOM', this);
	},

	updateDom: function() {
		//console.log('updateDom');

		if(!this.domElement) {
			return;
		}

		if(!this.domUpdateScheduled) {
			//console.log('scheduling executeDomUpdate')

			this.domUpdateScheduled = true;

			window.requestAnimationFrame(function() {
				this.executeDomUpdate();
			}.bind(this));
		}
		else {
			//console.log('executeDomUpdate already scheduled')
		}
	},

	executeDomUpdate: function() {
		console.log('this is getting called twice when I change theme, should only getting called once')
		console.log('executeDomUpdate');

		var domElementAttributesToUpdate = {};
		var domElementAttributeNames = {};

		// TODO: Maybe instead of looping everytime I can just keep track of what has changed on the HtmlElement class?

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
				console.log('removeAttribute', domElementAttributeToUpdateName);
				this.domElement.removeAttribute(domElementAttributeToUpdateName);
			}
			else if(domElementAttributeToUpdate.action == 'set') {
				console.log('setAttribute', domElementAttributeToUpdateName, domElementAttributeToUpdate.value);
				this.domElement.setAttribute(domElementAttributeToUpdateName, domElementAttributeToUpdate.value);
			}
		}.bind(this));

		// TODO: This is not performant ---------------------------------------
		// Should do comparisons between the source of truth (HtmlElement) and the existing domElements

		// Empty the domElement
		// TODO: Don't do this - it wipes out state for text inputs
		console.log('Don\'t do this - it wipes out state for text inputs');
		this.emptyDomElement();

		// Update the domElement's content, maintaining domElement references for each HtmlElement
		for(var i = 0; i < this.content.length; i++) {
			var content = this.content[i];

			// Create the child DOM element
			var childDomElement = document.createRange().createContextualFragment(content);

			// Append the child DOM element to this element's DOM element
			this.domElement.appendChild(childDomElement);

			// If we are adding an HtmlElement
			if(Class.isInstance(content, HtmlElement)) {
				content.domElement = this.domElement.lastChild;
				content.addedToDom();
			}
			// If we are adding a WebComponent
			else if(Class.isInstance(content, WebComponent)) {
				// Set the WebComponent's element.domElement property
				content.element.domElement = this.domElement.lastChild;
				content.addedToDom();
			}
		}

		// ---------------------------------------------------------------------

		this.domUpdateScheduled = false;
	},

	createIdentifier: function(stringOrElement) {
		if(Class.isInstance(stringOrElement, HtmlElement)) {
			// Set the identifier on the HtmlElement
			stringOrElement.identifier = stringOrElement.parent.identifier+'.'+this.identifierCounter;

			// Set the identifier on the domElement
			//stringOrElement.setAttribute('data-identifier', stringOrElement.identifier);

			// Increment the identifier counter
			this.identifierCounter++;
		}
	},

	emptyDomElement: function() {
		while(this.domElement.firstChild) {
			this.domElement.removeChild(this.domElement.firstChild);
		}

		return this.domElement;
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

		this.createIdentifier(stringOrElement);

		this.updateDom();

		return this;
	},

	prepend: function(stringOrElement) {
		this.super.apply(this, arguments);

		this.createIdentifier(stringOrElement);

		this.updateDom();

		return this;
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

		// Link the DOM element
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