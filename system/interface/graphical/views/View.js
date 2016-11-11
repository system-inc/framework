// Dependencies
import PropagatingEventEmitter from 'system/event/PropagatingEventEmitter.js';
import ViewEvent from 'system/interface/graphical/views/events/ViewEvent.js';
import ViewDimensions from 'system/interface/graphical/views/ViewDimensions.js';
import ViewPosition from 'system/interface/graphical/views/ViewPosition.js';

// Class
class View extends PropagatingEventEmitter {

	// EventEmitter
	eventClass = ViewEvent;

	graphicalInterface = null;
	adapter = null;
	
	subviews = {};
	
	attributes = {};

	dimensions = new ViewDimensions();
	position = {
		relativeToGraphicalInterface: new ViewPosition(),
		relativeToGraphicalInterfaceViewport: new ViewPosition(),
		relativeToDisplay: new ViewPosition(),
		relativeToAllDisplays: new ViewPosition(),
		relativeToPreviousAllDisplayRelativePosition: new ViewPosition(),
		relativeToRelativeAncestor: new ViewPosition(),
	};

	constructor() {
		super();

		this.graphicalInterface = app.interfaces.graphicalInterfaceManager.getCurrentGraphicalInterface();
		this.viewAdapter = app.interfaces.graphicalInterfaceManager.getViewAdapter(this);
	}

}

// Export
export default View;
