// Dependencies
import Dimensions from 'framework/system/interface/graphical/Dimensions.js';
import Position from 'framework/system/interface/graphical/Position.js';

// Class
class GraphicalInterfaceState {

	dimensions = new Dimensions();

	position = {
		relativeToDisplay: new Position(),
		relativeToAllDisplays: new Position(),
	};

	static constructFromSettingsWithDisplays(displays, type) {
		//app.exit('displays', displays);

		var graphicalInterfaceState = new GraphicalInterfaceState();

		var graphicalInterfaceSettings = app.settings.get('interfaces.graphical.defaults');
		//console.info('graphicalInterfaceSettings', graphicalInterfaceSettings);

		// Calculate the width from the settings
		var width = graphicalInterfaceSettings.width;
		var height = graphicalInterfaceSettings.height;

		var desiredDisplay = displays[1];

		// Handle width being a percentage
		if(width <= 1) {
			width = desiredDisplay.dimensions.width * width;
		}

		// Handle height being a percentage
		if(height <= 1) {
			height = desiredDisplay.dimensions.height * height;
		}

		graphicalInterfaceState.dimensions.width = width;
		graphicalInterfaceState.dimensions.height = height;

		graphicalInterfaceState.position.relativeToAllDisplays.x = 0;
		graphicalInterfaceState.position.relativeToAllDisplays.y = 0;
		//graphicalInterfaceState.position.relativeToAllDisplays.calculateCoordinatesAndEdges();

		return graphicalInterfaceState;
	}

}

// Export
export default GraphicalInterfaceState;
