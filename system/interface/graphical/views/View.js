// Dependencies
import PropagatingEventEmitter from 'system/event/PropagatingEventEmitter.js';
import XmlElement from 'system/xml/XmlElement.js';
import HtmlElement from 'system/interface/graphical/web/html/HtmlElement.js';
import ViewEvent from 'system/interface/graphical/views/events/ViewEvent.js';
import Settings from 'system/settings/Settings.js';
import Dimensions from 'system/interface/graphical/Dimensions.js';
import Position from 'system/interface/graphical/Position.js';
import TextView from 'system/interface/graphical/views/text/TextView.js';

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
	}

	initialize() {
		console.log('initialize()');

		this.adapter = app.interfaces.graphicalInterfaceManager.createViewAdapter(this);
		console.log('Created adapter', this.adapter.webView.tag);

		this.synchronizeWithAdapter();

		// Initialize all child views
		this.children.each(function(childViewIndex, childView) {
			childView.initialize();
			this.adapter.append(childView);
		}.bind(this));
	}

	synchronizeWithAdapter() {
		console.log('synchronizeWithAdapter()');

		// If the adapter exists
		if(this.adapter) {
			console.log('adapter exists, view has been initialized, starting to sync');

			this.adapter.synchronizeWithView();
		}
		else {
			console.log('skipping synchronizeWithAdapter(), waiting for view.initialize');
		}
	}

	render() {
		this.synchronizeWithAdapter();
	}

	prepend(childView) {
		this.children.prepend(childView);

		this.render();

		return this;
	}

	append(childView) {
		this.children.append(childView);

		this.render();

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

		this.render();

		return this;
	}

	removeClass() {
		HtmlElement.prototype.removeClass.apply(this, arguments);

		this.render();

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
