// Dependencies
import HtmlNode from './HtmlNode.js';
import XmlElement from './../../system/xml/XmlElement.js';
import HtmlElementEventEmitter from './events/html-element/HtmlElementEventEmitter.js';

// Class
class HtmlElement extends HtmlNode {

	// XmlNode instance properties
	type = 'element';

	// XmlElement instance properties
	tag = null;
	unary = false; // Tags are not unary (self-closing) by default
	attributes = {};
	children = []; // Array containing strings or elements

	// XmlElement instance methods
	toString = XmlElement.prototype.toString;

	constructor(tag, options, unary) {
		super(); // HtmlNode's constructor
		XmlElement.prototype.initialize.apply(this, arguments); // XmlElement's initialize

		// Detect if tags are supposed to be unary
		if(HtmlElement.unaryTags.contains(this.tag)) {
	 		this.unary = true;
	 	}

		// Update the DOM if attributes are already set
		if(Object.keys(this.attributes).length) {
			//app.log('Attributes already set on tag', this.tag);
			this.updateDom();
		}
	}

	// Method exists on XmlElement as well
	setAttribute(attributeName, attributeValue) {
		XmlElement.prototype.setAttribute.apply(this, arguments);

		this.updateDom();

		return this;
	}

	// Method exists on XmlElement as well
	removeAttribute(attributeName) {
		XmlElement.prototype.removeAttribute.apply(this, arguments);

		this.updateDom();

		return this;
	}

	// Method exists on XmlElement as well
	empty() {
		XmlElement.prototype.empty.apply(this, arguments);

		this.updateDom();

		return this;
	}

	// Method exists on XmlElement as well
	prepend(stringOrHtmlNode) {
		this.children.prepend(HtmlElement.makeHtmlNode(stringOrHtmlNode, this));

		this.updateDom();

		return this;
	}

	// Method exists on XmlElement as well
	append(stringOrHtmlNode) {
		if(!this.children) {
			throw new Error('HtmlElement instance does not have .children set, this should never happen, it should always be an array.');
		}

		this.children.append(HtmlElement.makeHtmlNode(stringOrHtmlNode, this));

		this.updateDom();

		return this;
	}

	setContent(content) {
		// Empty the current content
		this.empty();

		// Append the new content
		this.append(content);
	}

	descendFromParent(parent) {
		if(parent) {
			// Use HtmlNode's method
			super.descendFromParent(...arguments);

			// Add a DOM attribute for testing
			//this.setAttribute('data-nodeIdentifier', this.nodeIdentifier);

			// Reset the identifierCounter
			this.nodeIdentifierCounter = 0;

			// Recurse through all children to make sure they descend
			//app.log('this.children', this.children);
			this.children.each(function(childIndex, child) {
				child.descendFromParent(this);
			}.bind(this));
		}
	}

	applyDomUpdates() {
		//app.log('HtmlElement applyDomUpdates', this.tag);

		if(!this.domNode) {
			throw new Error('No .domNode present for tag '+this.tag+', this should never happen.');
		}

		// Update the DOM element's attributes
		this.updateDomNodeAttributes();

		// Update the DOM element's children
		this.updateDomNodeChildren();
	}

	updateDomNodeAttributes() {
		//app.log('updateDomNodeAttributes', this.tag, Json.encode(this.attributes));

		// TODO:
		// Because the virtual DOM is the state of truth, can we just keep track of all changes
		// on HtmlElement and then loop through and apply them? This would be more performant than
		// reading all of the attributes on the DOM and comparing them

		var domNodeAttributesToUpdate = {};
		var domNodeAttributeNames = {};

		// Loop through all of the DOM element's attributes
		this.domNode.attributes.each(function(domNodeAttributeIndex, domNodeAttribute) {
			//app.log(domNodeAttributeIndex, domNodeAttribute, domNodeAttribute.name, domNodeAttribute.value);

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

		//app.log('domNodeAttributesToUpdate', this.tag, domNodeAttributesToUpdate);

		// Update the DOM element's attributes
		domNodeAttributesToUpdate.each(function(domNodeAttributeToUpdateName, domNodeAttributeToUpdate) {
			if(domNodeAttributeToUpdate.action == 'remove') {
				//app.log('removeAttribute', domNodeAttributeToUpdateName);
				this.domNode.removeAttribute(domNodeAttributeToUpdateName);
			}
			else if(domNodeAttributeToUpdate.action == 'set') {
				//app.log('setAttribute', this.tag, domNodeAttributeToUpdateName, domNodeAttributeToUpdate.value);
				this.domNode.setAttribute(domNodeAttributeToUpdateName, domNodeAttributeToUpdate.value);
			}
		}.bind(this));
	}

	updateDomNodeChildren() {
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

				//app.log('Comparing to current domNode', 'currentChildDomNode', currentChildDomNode, 'child', child);

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
	}

	createDomNode(htmlElement) {
		// Allow this method to be called statically
		if(!htmlElement) {
			htmlElement = this;
		}

		// The DOM fragment is just for the tag, not for the children - must use document global here as this.domDocument may not be populated
		var domFragment = document.createElement(htmlElement.tag);
		//var domFragment = document.createElement(htmlElement.tag);
		//var domFragment = document.createRange().createContextualFragment(htmlElement.tagToString()); // This does not work consistently
		//app.log('HtmlElement domFragment for', htmlElement.tagToString(), domFragment);

		return domFragment;
	}

	addClass(className) {
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
	}

	removeClass(className) {
		var classAttributeValue = this.getAttribute('class');

		if(classAttributeValue) {
			var classes = classAttributeValue.split(' ');
			classes.deleteValue(className);

			this.setAttribute('class', classes.join(' '));
		}

		return this;
	}

	setStyle(propertyOrObject, value) {
		if(!this.attributes.style) {
			this.attributes.style = {};
		}

		// Allow strings and objects (for .setStyle({this:that, this:that}))
		if(String.is(propertyOrObject)) {
			this.attributes.style[propertyOrObject] = value;
		}
		else {
			propertyOrObject.each(function(property, value) {
				this.attributes.style[property] = value;
			}.bind(this));
		}
		
		this.updateDom();

		return this;
	}

	setHeight(height) {
		this.setStyle('height', height+'px');

		return this;
	}

	setWidth(width) {
		this.setStyle('width', width+'px');

		return this;
	}

	show() {
		//app.log('show');
		this.setStyle('display', 'flex');

		return this;
	}

	hide() {
		//app.log('hide');
		this.setStyle('display', 'none');

		return this;
	}

    focus() {
    	//app.log('HtmlElement.focus', this.tag, this.attributes);

        // If we have a domNode
        if(this.domNode) {
        	// Focus on the next update - this is important because you cannot .focus() on a DOM node unless it is visible
        	// Pending DOM updates may be making the DOM node visible, so we wait until they finish before calling .focus
        	this.once('htmlNode.domUpdateExecuted', function() {
				this.domNode.focus();
        	}.bind(this));

        	// Trigger an update
        	this.shouldExecuteDomUpdate = true;
        	this.updateDom();
        }

        return this;
    }

    find(selector) {
		var result = null;
		var domNode = this.domNode.querySelector(selector);
		//Console.standardInfo(domNodes);

		if(domNode && domNode.htmlNode) {
			result = domNode.htmlNode;
		}		

		return result;
	}

	static unaryTags = [
		'meta',
		'link',
		'base',
		'hr',
		'br',
		'wbr',
		'col',
		'img',
		'area',
		'source',
		'track',
		'param',
		'embed',
		'input',
		'keygen',
		'command',
	];

	static is(value) {
		return Class.isInstance(value, HtmlElement);
	}

	static makeHtmlNode(value, parent, type) {
		var alreadyIsHtmlNode = HtmlNode.is(value);

		// If the value is currently not of type HtmlNode (it must be a string), turn it into an HtmlNode
		if(!alreadyIsHtmlNode) {
			//Console.standardLog(value);

			if(value.contains('<')) {
				app.warn('HTML strings are not supported (I should implement), use View or HtmlElement or HtmlNode.', value);
			}

			value = new HtmlNode(value, parent, type);
		}
		// If the value is already an HtmlNode, make sure it inherits traits from the parent 
		else {
			value.descendFromParent(parent);
		}

		return value;
	}

	static createDomNode = HtmlElement.prototype.createDomNode;

	static attributeValueToString = XmlElement.attributeValueToString;

}

// Class implementations
Class.implement(HtmlElement, XmlElement);
Class.implement(HtmlElement, HtmlElementEventEmitter);

// Export
export default HtmlElement;
