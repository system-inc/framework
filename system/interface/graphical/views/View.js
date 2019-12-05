// Dependencies
import PropagatingEventEmitter from 'framework/system/event/PropagatingEventEmitter.js';
import XmlElement from 'framework/system/xml/XmlElement.js';
import HtmlElement from 'framework/system/interface/graphical/web/html/HtmlElement.js';
import ViewEvent from 'framework/system/interface/graphical/views/events/ViewEvent.js';
import Settings from 'framework/system/settings/Settings.js';
import Dimensions from 'framework/system/interface/graphical/Dimensions.js';
import Position from 'framework/system/interface/graphical/Position.js';
import ViewController from 'framework/system/interface/graphical/view-controllers/ViewController.js';

// Class
class View extends PropagatingEventEmitter {

	// EventEmitter
	eventClass = ViewEvent;

	adapter = null; // Adapts the view to an underlying component (e.g., an HtmlElement)

	identifier = null; // A unique identifier for the view

	attributes = {}; // Attributes for the view

	children = [];

	get dimensions() {
		return this.adapter.dimensions;
	}

	get position() {
		return this.adapter.position;
	}

	constructor() {
		// PropagatingEventEmitter
		super();

		// Create the adapter for the view
		//app.log('app.interfaces.graphical', app.interfaces.graphical);
		this.adapter = app.interfaces.graphical.createViewAdapter(this);
		//console.log('Created adapter', this.adapter);

		// Add the default classes
		this.addDefaultClasses();
	}

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

	async initialize() {
		// Initialize the adapter
		return await this.adapter.initialize(...arguments);
	}

	render() {
		this.adapter.render();
	}

	addEventListener() {
		//console.log('addEventListener', arguments, this);

		 this.adapter.addEventListener(...arguments);

		return super.addEventListener(...arguments);
	}

	removeEventListener() {
		this.adapter.removeEventListener(...arguments);

		return super.removeEventListener(...arguments);
	}

	removeAllEventListeners() {
		this.adapter.removeAllEventListeners(...arguments);

		return super.removeAllEventListeners(...arguments);
	}

	prepend(childView) {
		return this.addChild(childView, 'prepend');
	}

	append(childView) {
		if(ViewController.is(childView)) {
			throw new Error('ViewControllers cannot be appended to Views. You can however append ViewControllers to other ViewControllers and child ViewController\'s view will be appended to the parent\'s view.');
		}

		return this.addChild(childView, 'append');
	}

	addChild(childView, arrayMethod = 'append') {
		// Set the child's parent (PropagatingEventEmitter.append)
		super.append(childView);

		// Add the child view to the children array with the specified array method (append, prepend)
		this.children[arrayMethod](childView);

		// Run the same method on the adapter
		this.adapter[arrayMethod](childView);

		return childView;
	}

	empty() {
		XmlElement.prototype.empty.apply(this, arguments);

		return this.adapter.empty();
	}

	setContent(childView) {
		// Empty the current content
		this.empty();

		// Append the new content
		this.append(childView);

		return this;
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
		return this.adapter.hide();
	}

	focus() {
		return this.adapter.focus();
	}

	setHeight() {
		return this.adapter.setHeight(...arguments);
	}

	setWidth() {
		return this.adapter.setWidth(...arguments);
	}

	getAttribute = XmlElement.prototype.getAttribute;

	setAttribute(attributeName, attributeValue) {
		if(attributeValue === undefined) {
			console.error('View setAttribute', ...arguments);
			throw new Error('Invalid call to setAttribute.');
		}

		//console.info('setAttribute(attributeName, attributeValue)', ...arguments);

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

	setSelectionRange() {
		return this.adapter.setSelectionRange(...arguments);
	}

	// TODO: getValue and setValue should not exist here as they are not ubiquitous to all Views, just form views
	getValue() {
		return this.adapter.getValue(...arguments);
	}
	setValue() {
		return this.adapter.setValue(...arguments);
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
