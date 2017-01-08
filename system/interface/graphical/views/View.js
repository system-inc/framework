// Dependencies
import PropagatingEventEmitter from 'framework/system/event/PropagatingEventEmitter.js';
import XmlElement from 'framework/system/xml/XmlElement.js';
import HtmlElement from 'framework/system/interface/graphical/web/html/HtmlElement.js';
import ViewEvent from 'framework/system/interface/graphical/views/events/ViewEvent.js';
import Settings from 'framework/system/settings/Settings.js';
import Dimensions from 'framework/system/interface/graphical/Dimensions.js';
import Position from 'framework/system/interface/graphical/Position.js';

// Class
class View extends PropagatingEventEmitter {

	// EventEmitter
	eventClass = ViewEvent;

	adapter = null; // Adapts the view to an underlying component (e.g., an HtmlElement)

	identifier = null; // A unique identifier for the view

	attributes = {}; // Attributes for the view

	children = [];

	dimensions = new Dimensions();

	position = {
		relativeToGraphicalInterface: new Position(),
		relativeToGraphicalInterfaceViewport: new Position(),
		relativeToDisplay: new Position(),
		relativeToAllDisplays: new Position(),
		relativeToPreviousAllDisplayRelativePosition: new Position(),
		relativeToRelativeAncestor: new Position(),
	};

	constructor() {
		// PropagatingEventEmitter
		super();

		// Create the adapter for the view
		this.adapter = app.interfaces.graphicalInterfaceManager.createViewAdapter(this);
		//console.log('Created adapter', this.adapter.webView.tag);

		// Add a class to every view
		var classString = this.constructor.name.replaceLast('View', '').toCamelCase();
		if(classString !== '') {
			this.addClass(classString);	
		}
	}

	initialize() {
		// Initialize the adapter
		this.adapter.initialize(...arguments);
	}

	render() {
		this.adapter.render();
	}

	addEventListener() {
		//console.log('addEventListener', arguments, this);

		super.addEventListener(...arguments);

		return this.adapter.addEventListener(...arguments);
	}

	removeEventListener() {
		super.removeEventListener(...arguments);

		return this.adapter.removeEventListener(...arguments);
	}

	removeAllEventListeners() {
		super.removeAllEventListeners(...arguments);

		return this.adapter.removeAllEventListeners(...arguments);
	}

	prepend(childView) {
		return this.addChild(childView, 'prepend');
	}

	append(childView) {
		return this.addChild(childView, 'append');
	}

	addChild(childView, arrayMethod = 'append') {
		// Set the child's parent (PropagatingEventEmitter.append)
		super.append(childView);

		// Add the child view to the children array with the specified array method (append, prepend)
		this.children[arrayMethod](childView);

		// Run the same method on the adapter
		this.adapter[arrayMethod](childView);

		return this;
	}

	empty() {
		XmlElement.prototype.empty.apply(this, arguments);

		this.render();

		return this;
	}

	setContent(childView) {
		// Empty the current content
		this.empty();

		// Append the new content
		this.append(childView);
	}

	addClass() {
		HtmlElement.prototype.addClass.apply(this, arguments);

		// No need to call this.render as HtmlElement.prototype.addClass calls this.setAttribute which calls this.render
		//this.render();

		return this;
	}

	removeClass() {
		HtmlElement.prototype.removeClass.apply(this, arguments);

		// No need to call this.render as HtmlElement.prototype.removeClass calls this.setAttribute which calls this.render
		//this.render();

		return this;
	}

	setStyle() {
		HtmlElement.prototype.setStyle.apply(this, arguments);

		// No need to call this.render as HtmlElement.prototype.setStyle calls this.setAttribute which calls this.render
		//this.render();

		return this;
	}

	show() {
		return this.adapter.show();
	}

	hide() {
		return this.adapter.show();
	}

	focus() {
		return this.adapter.focus();
	}

	getAttribute = XmlElement.prototype.getAttribute;

	setAttribute(attributeName, attributeValue) {
		XmlElement.prototype.setAttribute.apply(this, arguments);

		this.render();

		return this;
	}

	removeAttribute(attributeName) {
		XmlElement.prototype.removeAttribute.apply(this, arguments);

		this.render();

		return this;
	}

	select() {
		return this.adapter.select();
	}

	getSelectionText() {
		return this.adapter.getSelectionText();
	}

	press() {
		return this.adapter.press();
	}

	find(selector) {
		// TODO: Find descendants which match the selector
	}

	getWebViewAdapterSettings() {
		return {
			tag: 'div',
		};
	}

	getIOsViewAdapterSettings() {
		return {
		};
	}

	getAndroidViewAdapterSettings() {
		return {
		};
	}

	static is(value) {
		return Class.isInstance(value, View);
	}

	static attributeValueToString = XmlElement.attributeValueToString;

}

// Export
export default View;
