HtmlElement = XmlElement.extend({

	domElement: null,

	addToDom: function() {
		// "this.domElement" is either be document.head or document.body
		if(this.domElement) {
			// Apply attribrutes
			this.attributes.each(function(attributeName, attributeValue) {
				this.domElement.setAttribute(attributeName, attributeValue);
			}.bind(this));

			// Add child content to the DOM
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

			this.addedToDom();
		}
	},

	addedToDom: function() {
		//console.log('HtmlElement added to DOM', this);
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
		if(this.domElement) {
			this.domElement.style.height = height+'px';
		}
	},

	width: function(width) {
		if(this.domElement) {
			this.domElement.style.width = width+'px';
		}
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