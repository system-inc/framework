// Dependencies
import PrimitiveView from 'framework/system/interface/graphical/views/PrimitiveView.js';
import XmlElement from 'framework/system/xml/XmlElement.js';
import HtmlElement from 'framework/system/interface/graphical/web/html/HtmlElement.js';
import ViewController from 'framework/system/interface/graphical/view-controllers/ViewController.js';

// Class
class View extends PrimitiveView {

	// From XmlElement
	attributes = {};
	children = [];

	constructor(options = null) {
		// PrimitiveView
		super();

		// this.content is an alias for this.children
		this.content = this.children;

		// Add the default classes
		this.addDefaultClasses();

		// See XmlElement .initialize() - allow lots of flexibility with options
		if(options !== null) {
			//app.log('View constructor options', options);

			// Options may be a string (or any primitive) or PrimitiveViews which will be appended
			if(Primitive.is(options) || PrimitiveView.is(options)) {
				this.append(options);
			}
			// Options may be an array of primitives or PrimitiveViews which will be appended
			else if(Array.is(options)) {
				options.each(function(primitiveOrPrimitiveViewIndex, primitiveOrPrimitiveView) {
					this.append(primitiveOrPrimitiveView);
				}.bind(this));
			}
			// Options may be an object with content or children, or attributes
			else {
				options.each(function(optionName, optionValue) {
					// Handle content/children
					if(optionName == 'content' || optionName == 'children') {
						// Allow arrays of children
						if(Array.is(optionValue)) {
							optionValue.each(function(primitiveOrPrimitiveViewIndex, primitiveOrPrimitiveView) {
								this.append(primitiveOrPrimitiveView);
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
	}

	// See HtmlElement .setParent()
	setParent(parent) {
		super.setParent(parent);

		// Set this attribute for debugging
		//this.setAttribute('data-nodeIdentifier', this.nodeIdentifier);

		// Update all of the children
		this.children.each(function(childIndex, child) {
			child.setParent(this);
		}.bind(this));
	}

	// See HtmlElement .unmountedFromDom()
	detached() {
		super.detached();

		// Update all of the children
		this.children.each(function(childIndex, child) {
			child.detached();
		}.bind(this));
	}

	// Use logic from XmlElement
	prepend = XmlElement.prototype.prepend;

	// Use logic from XmlElement
	append = XmlElement.prototype.append;

	// See HtmlElement .addChild() and XmlElement .addChild()
	addChild(primitiveOrPrimitiveView, arrayMethod = 'append') {
		// Do not allow view controllers to be appended to views
		if(ViewController.is(primitiveOrPrimitiveView)) {
			throw new Error('ViewControllers may not be appended to Views. You can however append ViewControllers to other ViewControllers and child ViewController\'s view will be appended to the parent\'s view.');
		}

		var primitiveView = null;

		// If the child is a PrimitiveView (or View)
		if(PrimitiveView.is(primitiveOrPrimitiveView)) {
			primitiveView = primitiveOrPrimitiveView;
		}
		// Content is allowed to be a primitive such a string or a number, convert it into a PrimitiveView
		else {
			primitiveView = new PrimitiveView(primitiveOrPrimitiveView);
		}

		// Throw an error if the child already has a parent
		if(primitiveView.parent !== null) {
			throw new Error('This view already has a parent. It may not be added to a different parent until it has been removed from its current parent.');
		}

		// Set the parent
		primitiveView.setParent(this);

		// Add the child view to the children array with the specified array method (append, prepend)
		this.children[arrayMethod](primitiveView);

		// Run this method on the adapter
		this.adapter.addChild(primitiveView, arrayMethod);

		return this;
	}

	// See HtmlElement .removeChild() and XmlElement .removeChild()
	removeChild(childView) {
		// Use logic from XmlElement to remove the child view from this view
		XmlElement.prototype.removeChild.apply(this, arguments);

		this.adapter.removeChild(childView);

		return this;
	}

	// Use logic from XmlElement
	remove = XmlElement.prototype.remove;

	// Use logic from XmlElement
	empty = XmlElement.prototype.empty;

	// Use logic from XmlElement
	setContent = XmlElement.prototype.setContent;

	// Use logic from XmlElement
	getAttribute = XmlElement.prototype.getAttribute;

	// See HtmlElement .setAttribute() and XmlElement .setAttribute()
	setAttribute(attributeName, attributeValue) {
		// Use logic from XmlElement to set the attribute
		XmlElement.prototype.setAttribute.apply(this, arguments);

		this.adapter.setAttribute(...arguments);

		return this;
	}

	// See HtmlElement .removeAttribute() and XmlElement .removeAttribute()
	removeAttribute(attributeName) {
		// Use logic from XmlElement to remove the attribute
		XmlElement.prototype.removeAttribute.apply(this, arguments);

		this.adapter.removeAttribute(...arguments);

		return this;
	}

	// Use logic from HtmlElement
	addClass = HtmlElement.prototype.addClass;

	// Use logic from HtmlElement
	removeClass = HtmlElement.prototype.removeClass;

	// Use logic from HtmlElement
	setStyle = HtmlElement.prototype.setStyle;

	addDefaultClasses() {
		// Get the class hierarchy (current class name and super class names up to View)
		var classHierarchy = Class.getClassHierarchyFromInstance(this, 'View');

		// If there are classes up to View
		if(classHierarchy.length) {
			var classString = '';

			classHierarchy.each(function(index, className) {
				classString += className.replaceLast('View', '').toCamelcase()+' ';
			});
			
			classString = classString.replaceLast(' ', '');

			this.addClass(classString);
		}
	}

	// See HtmlElement .show()
	show() {
		this.adapter.show();

		return this;
	}

	// See HtmlElement .hide()
	hide() {
		this.adapter.hide();

		return this;
	}

	// See HtmlElement .setHeight()
	setHeight() {
		this.adapter.setHeight(...arguments);

		return this;
	}

	// See HtmlElement .setWidth()
	setWidth() {
		this.adapter.setWidth(...arguments);

		return this;
	}

	// See HtmlElement .focus()
	focus() {
		this.adapter.focus();

		return this;
	}

	// See HtmlElement .find()
	find(selector) {
		throw new Error('Not implemented yet.');
		// TODO: Find descendants which match the selector
	}

	getWebViewAdapterSettings() {
		return {
			tag: 'div',
		};
	}

	// Use logic from XmlElement
	static attributeValueToString = XmlElement.attributeValueToString;

	static is(value) {
		return Class.isInstance(value, View);
	}

}

// Export
export default View;
