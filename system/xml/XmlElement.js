// Dependencies
import XmlNode from './XmlNode.js';

// Class
class XmlElement extends XmlNode {

	// XmlNode properties
	type = 'element';

	// XmlElement properties
	tag = null;
	unary = false; // Tags are not unary (self-closing) by default
	attributes = {};
	children = []; // Array containing strings or elements

	constructor(tag, options, unary) {
		super();

		// this.children is an array and this.content is an alias to it
		this.content = this.children;

		if(tag !== undefined) {
			this.tag = tag;
		}

		// If unary is passed
		if(unary !== undefined) {
			this.unary = unary;
		}

		// Allow options to be strings (or any primitive) or XmlNodes which will be used as the default content
		if(options && (Primitive.is(options) || XmlNode.is(options))) {
			this.append(options);
		}
		// Allow options to be an object
		else if(options) {
			//app.log(options);

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
	}

	getAttribute(attributeName) {
		var attribute = null;

		if(this.attributes[attributeName]) {
			attribute = this.attributes[attributeName];
		}

		return attribute;
	}

	setAttribute(attributeName, attributeValue) {
		this.attributes[attributeName] = attributeValue;

		return this;
	}

	removeAttribute(attributeName) {
		if(this.attributes[attributeName]) {
			delete this.attributes[attributeName];
		}

		return this;
	}

	empty() {
		this.children = [];

		return this;
	}

	prepend(stringOrXmlNode) {
		this.children.prepend(XmlNode.makeXmlNode(stringOrXmlNode, this));

		return this;
	}

	append(stringOrXmlNode) {
		this.children.append(XmlNode.makeXmlNode(stringOrXmlNode, this));

		return this;
	}

	tagOpeningToString() {
		var string = '<'+this.tag;

		// Attributes
		this.attributes.each(function(attributeName, attributeValue) {
			string += ' '+attributeName+'="'+XmlElement.attributeValueToString(attributeValue)+'"';
		});

		if(!this.unary) {
			string += '>';
		}	

		return string;
	}

	tagClosingToString() {
		var string = '';

		if(this.unary) {
			string += ' />';
		}
		else {
			string += '</'+this.tag+'>';
		}

		return string;
	}

	// Just the tag without the children
	tagToString() {
		var string = this.tagOpeningToString();
		string += this.tagClosingToString();

		return string;
	}

	// Just the children without the tag
	childrenToString(indent, indentationLevel, indentationCharacter, indentationRepetitions) {
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
	}

	toString(indent, indentationLevel) {
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
	}

	static is(value) {
		return Class.isInstance(value, XmlElement);
	}

	static attributeValueToString(attributeValue) {
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

}

// Export
export default XmlElement;
