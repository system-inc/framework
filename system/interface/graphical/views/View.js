// Dependencies
import PropagatingEventEmitter from 'system/event/PropagatingEventEmitter.js';
import ViewEvent from 'system/interface/graphical/views/events/ViewEvent.js';
import Dimensions from 'system/interface/graphical/Dimensions.js';
import Position from 'system/interface/graphical/Position.js';

// Class
class View extends PropagatingEventEmitter {

	// EventEmitter
	eventClass = ViewEvent;

	adapter = null;

	identifier = null;

	content = null;
	
	subviews = {};
	
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

		if(content) {
			this.content = content;
		}

		this.viewAdapter = app.interfaces.graphicalInterfaceManager.getViewAdapter();
	}

}

// Export
export default View;
