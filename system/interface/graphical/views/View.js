// Dependencies
import PropagatingEventEmitter from 'system/event/PropagatingEventEmitter.js';
import ViewEvent from 'system/interface/graphical/views/events/ViewEvent.js';
import Settings from 'system/settings/Settings.js';
import Dimensions from 'system/interface/graphical/Dimensions.js';
import Position from 'system/interface/graphical/Position.js';
import TextView from 'system/interface/graphical/views/text/TextView.js';

// Class
class View extends PropagatingEventEmitter {

	// EventEmitter
	eventClass = ViewEvent;

	adapter = null;

	identifier = null;

	attributes = {};

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
		// Create the adapter from the graphical interface manager
		this.adapter = app.interfaces.graphicalInterfaceManager.createViewAdapter(this);

		this.children.each(function(index, childView) {
			childView.initialize();
			this.adapter.append(childView);
		}.bind(this));
	}

	append(childView) {
		this.children.append(childView);
	}

	addClass() {
		this.adapter.addClass(...arguments);
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

}

// Export
export default View;
