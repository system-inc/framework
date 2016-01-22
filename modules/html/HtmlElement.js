HtmlElement = XmlElement.extend({

	domElement: null,

	addToDom: function() {
		// "this.domElement" is either be document.head or document.body
		if(this.domElement) {
			this.updateDom();
			this.addedToDom();
		}
	},

	addedToDom: function() {
		//console.log('HtmlElement added to DOM', this);
	},

	updateDom: function() {
		if(this.domElement) {
			// Update the domElement's attributes
			this.attributes.each(function(attributeName, attributeValue) {
				var attributeValueString = attributeValue;

				// Attributes that are not strings are turned into a string, e.g., "property1: value1; property2: value2;""
				if(!String.is(attributeValue)) {
					attributeValueString = '';

					attributeValue.each(function(subAttributeName, subAttributeValue) {
						attributeValueString += subAttributeName+': '+subAttributeValue+'; ';
					});

					attributeValueString = attributeValueString.trim();
				}

				this.domElement.setAttribute(attributeName, attributeValueString);
			}.bind(this));

			// Empty the domElement
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
			domElement.addEventListener(eventName, callback);
		}
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

	height: function(height) {
		this.setStyle('height', height+'px');
	},

	width: function(width) {
		this.setStyle('width', width+'px');
	},

	show: function() {
		this.setStyle('display', 'block');
	},

	hide: function() {
		this.setStyle('display', 'none');
	},

	setContent: function(content) {
		this.content = Array.wrap(content);
		
		this.updateDom();
	},

	setStyle: function(property, value) {
		if(!this.attributes.style) {
			this.attributes.style = {};
		}

		this.attributes.style[property] = value;

		this.updateDom();
	},

	empty: function() {
		this.content = [];

		this.updateDom();
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