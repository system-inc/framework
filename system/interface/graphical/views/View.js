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

		// Add a class to every view
		var classString = this.constructor.name.replaceLast('View', '').toCamelCase();
		if(classString != '') {
			this.addClass(classString);	
		}
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
			console.log('adapter exists, view has been initialized, starting to sync', this);
			this.adapter.synchronizeWithView();

			console.error('need to make sure children are initialized');
		}
		else {
			console.log('skipping synchronizeWithAdapter(), waiting for view.initialize', this);
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
		if(!View.is(childView)) {
			//childView = new View();
			this.text = childView;
		}
		else {
			this.children.append(childView);
		}

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

	setStyle() {
		HtmlElement.prototype.setStyle.apply(this, arguments);

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
