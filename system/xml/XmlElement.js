// Dependencies
import { XmlNode } from '@framework/system/xml/XmlNode.js';

// Class
class XmlElement extends XmlNode {

	// XmlNode properties
	type = 'element';

	// XmlElement properties
	tag = null;
	unary = false; // Tags are not unary (self-closing) by default
	attributes = {};
	children = []; // Array containing strings or elements

	constructor(tag, options, unary = false, parent = null) {
		// XmlNode
		// Do not pass parent into this, will use initialize to set the parent
		super(this.children);

		// Initialize the XmlElement
		this.initialize(tag, options, unary, parent);
	}

	// A separate initialize function which is not part of the constructor so it can be invoked by HtmlElement
	initialize(tag, options = null, unary = false, parent = null) {
		// this.content is an alias for this.children
		this.content = this.children;

		// Set the tag
		if(tag) {
			this.tag = tag;
		}

		// Allow lots of flexibility with options
		if(options !== null) {
			//app.log('XmlElement initialize options', options);

			// Options may be a string (or any primitive) or XmlNodes which will be appended
			if(Primitive.is(options) || XmlNode.is(options)) {
				this.append(options);
			}
			// Options may be an array of primitives or XmlNodes which will be appended
			else if(Array.is(options)) {
				options.each(function(primitiveOrXmlNodeIndex, primitiveOrXmlNode) {
					this.append(primitiveOrXmlNode);
				}.bind(this));
			}
			// Options may be an object with content or children, or attributes
			else {
				options.each(function(optionName, optionValue) {
					// Handle content/children
					if(optionName == 'content' || optionName == 'children') {
						// Allow arrays of children
						if(Array.is(optionValue)) {
							optionValue.each(function(primitiveOrXmlNodeIndex, primitiveOrXmlNode) {
								this.append(primitiveOrXmlNode);
							}.bind(this));
						}
						// A single child
						else {
							this.append(optionValue);
						}
					}
					// All other option keys and values are attributes
					else {
						this.setAttribute(optionName, optionValue);
					}
				}.bind(this));
			}
		}

		// Set unary
		this.unary = unary;

		// Set the parent
		if(parent !== null) {
			this.setParent(parent);
		}		
	}

	setParent(parent) {
		super.setParent(parent);

		this.children.each(function(childIndex, child) {
			child.setParent(this);
		}.bind(this));
	}

	prepend(primitiveOrXmlNode) {
		return this.addChild(primitiveOrXmlNode, 'prepend');
	}

	append(primitiveOrXmlNode) {
		return this.addChild(primitiveOrXmlNode, 'append');
	}

	addChild(primitiveOrXmlNode, arrayMethod = 'append') {
		var xmlNode = null;

		// If the child is an XmlNode (or XmlElement)
		if(XmlNode.is(primitiveOrXmlNode)) {
			xmlNode = primitiveOrXmlNode;
		}
		// Content is allowed to be a primitive such a string or a number, convert it into an XmlNode
		else {
			xmlNode = XmlNode.makeXmlNode(primitiveOrXmlNode);
		}

		// Throw an error if the child already has a parent
		if(xmlNode.parent !== null) {
			throw new Error('This node already has a parent. It may not be added to a different parent until it has been removed from its current parent.');
		}

		// Set the parent
		xmlNode.setParent(this);
		
		// Add the child to the children array with the specified array method (append, prepend)
		this.children[arrayMethod](xmlNode);

		return this;
	}

	removeChild(child) {
		// Remove the parent from the child
		child.orphan();

		// Delete the child from the children array
		this.children.deleteValue(child);

		return this;
	}

	remove() {
		// Remove this element from the parent's children
		this.parent.removeChild(this);

		return this;
	}

	empty() {
		// Loop through the children and remove each one
		this.children.each(function(childIndex, child) {
			child.remove();
		}, 'descending'); // Loop backwards as we are removing elements of the array in the loop and the array will be reindexed

		return this;
	}

	setContent(content) {
		// Empty the current content
		this.empty();

		// Append the new content
		this.append(content);

		return this;
	}

	getAttribute(attributeName) {
		var attribute = null;

		if(this.attributes[attributeName]) {
			attribute = this.attributes[attributeName];
		}

		return attribute;
	}

	setAttribute(attributeName, attributeValue) {
		if(attributeValue === undefined) {
			throw new Error('Invalid call to setAttribute.');
		}

		// Do not allow null attributes
		if(attributeValue !== null) {			
			this.attributes[attributeName] = attributeValue;
		}

		return this;
	}

	removeAttribute(attributeName) {
		if(this.attributes[attributeName]) {
			delete this.attributes[attributeName];
		}

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

	static is(value) {
		return Class.isInstance(value, XmlElement);
	}

}

// Export
export { XmlElement };
