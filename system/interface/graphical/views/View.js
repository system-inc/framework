// Dependencies
import PropagatingEventEmitter from 'system/event/PropagatingEventEmitter.js';
import ViewEvent from 'system/interface/graphical/views/events/ViewEvent.js';
import Settings from 'system/settings/Settings.js';
import Dimensions from 'system/interface/graphical/Dimensions.js';
import Position from 'system/interface/graphical/Position.js';

// Class
class View extends PropagatingEventEmitter {

	// EventEmitter
	eventClass = ViewEvent;

	adapter = null;
	adapterSettings = new Settings({
		web: {
			tag: 'div',
		},
	});

	identifier = null;

	content = null;
	
	subviews = {};

	viewReferences = {};
	
	attributes = {};

	dimensions = new Dimensions();

	position = {
		relativeToGraphicalInterface: new Position(),
		relativeToGraphicalInterfaceViewport: new Position(),
		relativeToDisplay: new Position(),
		relativeToAllDisplays: new Position(),
		relativeToPreviousAllDisplayRelativePosition: new Position(),
		relativeToRelativeAncestor: new Position(),
	};

	constructor(content) {
		super();

		// Set the content
		if(content !== undefined) {
			this.content = content;
		}

		// Create subviews
		this.createSubviews();

		// Create the adapter from the graphical interface manager
		this.adapter = app.interfaces.graphicalInterfaceManager.createViewAdapter(this);
	}

	createSubviews() {
		// This method will be implemented by child classes
	}

	append() {
		this.adapter.append(...arguments);
	}

}

// Export
export default View;
