HtmlElement = XmlElement.extend({

	domElement: null,

	apply: function() {
		if(this.domElement) {
			// Apply attribrutes
			this.attributes.each(function(attributeName, attributeValue) {
				this.domElement.setAttribute(attributeName, attributeValue);
			}.bind(this));

			// Set the content
			this.content.each(function(index, content) {
				// Create the child DOM element
				var childDomElement = document.createRange().createContextualFragment(content);

				// Append the child DOM element to this element's DOM element
				this.domElement.appendChild(childDomElement);
			}.bind(this));
		}
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

	clone: function() {
		// Create a new HtmlElement
		var htmlElement = new HtmlElement(this.tag, null, this.unary);

		// Clone the attributes
		htmlElement.attributes = Object.clone(this.attributes);

		// Clone the content
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

		return htmlElement;
	},

});