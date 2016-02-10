XmlElement = XmlNode.extend({

	// XmlNode properties
	type: 'element',

	// XmlElement properties
	tag: null,
	unary: false, // Tags are not unary (self-closing) by default
	attributes: {},
	children: null, // Array containing strings or elements

	construct: function(tag, options, unary) {
		// this.content is an array and this.children is an alias to it
		this.children = this.content = [];

		if(tag !== undefined) {
			this.tag = tag;
		}

		// If unary is passed
		if(unary !== undefined) {
			this.unary = unary;
		}

		// Allow options to be strings (or any primitive) which will be used as the default content
		if(options && Primitive.is(options)) {
			this.append(options);
		}
		// Allow options to be an object
		else if(options) {
			//Console.out(options);

			options.each(function(optionName, optionValue) {
				// Handle content (children)
				if(optionName == 'content' || optionName == 'children') {
					this.append(optionValue);
				}
				// Handle unary being passed as an option
				else if(optionName == 'unary') {
					this.unary = optionValue;
				}
				else {
					this.setAttribute(optionName, optionValue);
				}
			}.bind(this));
		}
	},

	getAttribute: function(attributeName) {
		var attribute = null;

		if(this.attributes[attributeName]) {
			attribute = this.attributes[attributeName];
		}

		return attribute;
	},

	setAttribute: function(attributeName, attributeValue) {
		this.attributes[attributeName] = attributeValue;

		return this;
	},

	removeAttribute: function(attributeName) {
		if(this.attributes[attributeName]) {
			delete this.attributes[attributeName];
		}

		return this;
	},

	empty: function() {
		this.children = [];

		return this;
	},

	prepend: function(stringOrXmlNode) {
		this.children.prepend(XmlNode.makeXmlNode(stringOrXmlNode, this));

		return this;
	},	

	append: function(stringOrXmlNode) {
		this.children.append(XmlNode.makeXmlNode(stringOrXmlNode, this));

		return this;
	},

	tagOpeningToString: function() {
		var string = '<'+this.tag;

		// Attributes
		this.attributes.each(function(attributeName, attributeValue) {
			string += ' '+attributeName+'="'+XmlElement.attributeValueToString(attributeValue)+'"';
		});

		if(!this.unary) {
			string += '>';
		}	

		return string;
	},

	tagClosingToString: function() {
		var string = '';

		if(this.unary) {
			string += ' />';
		}
		else {
			string += '</'+this.tag+'>';
		}

		return string;
	},

	// Just the tag without the children
	tagToString: function() {
		var string = this.tagOpeningToString();
		string += this.tagClosingToString();

		return string;
	},

	// Just the children without the tag
	childrenToString: function(indent, indentationLevel, indentationCharacter, indentationRepetitions) {
		var string = '';

		this.children.each(function(index, xmlNode) {
			if(indent) {
				// If we have an XmlElement, call it's .toString() method with indentation
				if(XmlElement.is(xmlNode)) {
					string += xmlNode.toString(indent, indentationLevel + 1);
				}
				// If we just have an XmlNode, add it to the string with indentation
				else {
					string += String.newline+indentationCharacter.repeat(indentationRepetitions * (indentationLevel + 1))+xmlNode;
				}
			}
			else {
				string += xmlNode;
			}
		});

		return string;
	},

	toString: function(indent, indentationLevel) {
		var string = '';
		var indentationRepetitions = 4;
		var indentationCharacter = ' ';

		if(indent) {
			if(!indentationLevel) {
				indentationLevel = 0;
			}

			string += String.newline+indentationCharacter.repeat(indentationRepetitions * indentationLevel);
		}

		// Open the tag
		string += this.tagOpeningToString();

		// If the tag is not unary and it has children, add the children
		if(!this.unary && this.children.length) {
			string += this.childrenToString(indent, indentationLevel, indentationCharacter, indentationRepetitions);

			// If there are children and we are indenting
			if(this.children.length && indent) {
				// Apply the indenting
				string += String.newline+indentationCharacter.repeat(indentationRepetitions * indentationLevel);
			}
		}

		// Close the tag
		string += this.tagClosingToString();

		return string;
	},

});

// Static methods
XmlElement.is = function(value) {
	return Class.isInstance(value, XmlElement);
}

XmlElement.attributeValueToString = function(attributeValue) {
	var attributeValueString = attributeValue;

	// Attributes that are not strings are turned into a string, e.g., "property1: value1; property2: value2;""
	if(!String.is(attributeValue)) {
		attributeValueString = '';

		attributeValue.each(function(subAttributeName, subAttributeValue) {
			attributeValueString += subAttributeName+': '+subAttributeValue+'; ';
		});

		attributeValueString = attributeValueString.trim();
	}

	return attributeValueString;
}