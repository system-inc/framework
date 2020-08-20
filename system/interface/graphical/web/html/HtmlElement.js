// Dependencies
import HtmlNode from 'framework/system/interface/graphical/web/html/HtmlNode.js';
import XmlElement from 'framework/system/xml/XmlElement.js';
import HtmlElementEventEmitter from 'framework/system/interface/graphical/web/html/events/html-element/HtmlElementEventEmitter.js';

// Class (implements XmlElement and HtmlElementEventEmitter)
class HtmlElement extends HtmlNode {

	// XmlNode instance properties
	type = 'element';

	// XmlElement instance properties
	tag = null;
	unary = false; // Tags are not unary (self-closing) by default
	attributes = {};
	children = []; // Array containing strings or elements

	constructor(tag, options, unary = false, parent = null) {
		// HtmlNode's constructor (does nothing, but is required to setup the prototype chain)
		super();

		// Use XmlElement's initialize function as part of our constructor
		XmlElement.prototype.initialize.apply(this, arguments);

		// Detect if tags are supposed to be unary
		if(HtmlElement.unaryTags.contains(this.tag)) {
	 		this.unary = true;
	 	}

		// Update the DOM if children or attributes are already set
		if(this.children.length || Object.keys(this.attributes).length) {
			//app.log('Children or attributes already set on tag', this.tag);
			this.render();
		}
	}

	// See XmlElement .setParent()
	setParent(parent) {
		super.setParent(parent);

		// Set this attribute for debugging
		//this.setAttribute('data-nodeIdentifier', this.nodeIdentifier);

		// Update all of the children
		this.children.each(function(childIndex, child) {
			child.setParent(this);
		}.bind(this));
	}

	// Use logic from XmlElement (not PropagatingEventEmitter)
	append = XmlElement.prototype.append;

	// See XmlElement .addChild()
	addChild(primitiveOrHtmlNode, arrayMethod = 'append') {
		var htmlNode = null;

		// If the child is an HtmlNode (or HtmlElement)
		if(HtmlNode.is(primitiveOrHtmlNode)) {
			htmlNode = primitiveOrHtmlNode;
		}
		// Content is allowed to be a primitive such a string or a number, convert it into an HtmlNode
		else {
			htmlNode = HtmlNode.makeHtmlNode(primitiveOrHtmlNode);
		}

		// Throw an error if the child already has a parent
		if(htmlNode.parent !== null) {
			throw new Error('This node already has a parent. It may not be added to a different parent until it has been removed from its current parent.');
		}

		// Set the parent
		htmlNode.setParent(this);
		
		// Add the child to the children array with the specified array method (append, prepend)
		this.children[arrayMethod](htmlNode);

		this.render();

		return this;
	}

	// See XmlElement .removeChild()
	removeChild(child) {
		// Use logic from XmlElement
		XmlElement.prototype.removeChild.apply(this, arguments);

		this.render();

		return this;
	}

	// See XmlElement .setAttribute()
	setAttribute(attributeName, attributeValue) {
		// Use logic from XmlElement
		XmlElement.prototype.setAttribute.apply(this, arguments);

		this.render();

		return this;
	}

	// See XmlElement .removeAttribute()
	removeAttribute(attributeName) {
		// Use logic from XmlElement
		XmlElement.prototype.removeAttribute.apply(this, arguments);

		this.render();

		return this;
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
			if(value === null) {
				delete this.attributes.style[propertyOrObject];
			}
			else {
				this.attributes.style[propertyOrObject] = value;
			}
		}
		else {
			propertyOrObject.each(function(property, value) {
				// Convert "borderBottom" to "border-bottom"
				property = property.toDashes();
				this.attributes.style[property] = value;

				if(value === null) {
					delete this.attributes.style[property];
				}
				else {
					this.attributes.style[property] = value;
				}
			}.bind(this));
		}

		// This will trigger render
		this.setAttribute('style', this.attributes.style);

		return this;
	}

	show() {
		this.setStyle('display', 'flex');

		return this;
	}

	hide() {
		this.setStyle('display', 'none');

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

    focus() {
    	// Resolve the promise once the DOM node has received focus
    	return new Promise(function(resolve) {
    		//console.log('HtmlElement.focus', this.tag, this.attributes);

	        // If we have a domNode
	        if(this.domNode) {
	        	// Focus on the next update - this is important because you cannot .focus() on a DOM node unless it is visible
	        	// Pending DOM updates may be making the DOM node visible, so we wait until they finish before calling .focus
	        	this.once('htmlNode.domUpdateExecuted', function() {
					this.domNode.focus();
					resolve(this);
	        	}.bind(this));

	        	// Trigger an update
	        	this.shouldExecuteDomUpdate = true;
	        	this.render();
	        }

	        return this;
    	}.bind(this));
    }

    find(selector) {
		var result = null;
		var domNode = this.domNode.querySelector(selector);
		//console.info(domNodes);

		if(domNode && domNode.htmlNode) {
			result = domNode.htmlNode;
		}		

		return result;
	}

	applyDomUpdates() {
		//app.log('HtmlElement applyDomUpdates', this.tag);

		if(!this.domNode) {
			throw new Error('No .domNode present for tag '+this.tag+', this should never happen.');
		}

		// Update the DOM element's attributes
		this.renderNodeAttributes();

		// Update the DOM element's children
		this.renderNodeChildren();
	}

	renderNodeAttributes() {
		//app.log('renderNodeAttributes', this.tag, Json.encode(this.attributes));

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
			//if(!String.is(attributeName)) {
			//	console.error('attributeName is not a string', attributeName);
			//}

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

	renderNodeChildren() {
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
		for(var i = this.children.length; i < this.domNode.childNodes.length; i++) {
			var childToRemove = this.domNode.childNodes[i];
			this.domNode.removeChild(childToRemove);
		}
	}

	unmountedFromDom() {
		super.unmountedFromDom();

		// Update all of the children
		this.children.each(function(childIndex, child) {
			child.unmountedFromDom();
		}.bind(this));
	}

	createDomNode() {
		return HtmlElement.createDomNode(this);
	}

	// Use logic from XmlElement
	toString = XmlElement.prototype.toString;

	static createDomNode(htmlElement) {
		// The DOM fragment is just for the tag, not for the children - must use document global here as this.domDocument may not be populated
		var domFragment = document.createElement(htmlElement.tag);
		//var domFragment = document.createRange().createContextualFragment(htmlElement.tagToString()); // This does not work consistently
		//app.log('HtmlElement domFragment for', htmlElement.tagToString(), domFragment);

		return domFragment;
	}

	static attributeValueToString = XmlElement.attributeValueToString;

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

}

// Class implementations
Class.implement(HtmlElement, XmlElement);
Class.implement(HtmlElement, HtmlElementEventEmitter);

// Export
export default HtmlElement;
