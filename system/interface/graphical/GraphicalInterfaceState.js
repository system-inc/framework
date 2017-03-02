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

	static getSettings(type = null) {
		var settings = null;
		var defaultSettings = app.settings.get('interfaces.graphical.defaults');

		// If the user specified a type for the interface
		if(type) {
			// Merge the type settings with the default settings
			var typeSettings = app.settings.get('interfaces.graphical.types.'+type);
			settings = defaultSettings.merge(typeSettings);
		}
		// If no type, just take the defaults
		else {
			settings = defaultSettings;
		}
		//console.info('GraphicalInterfaceState settings', settings);

		return settings;
	}

	static constructFromSettingsWithDisplays(settings, displays) {
		//console.info('settings', settings, 'displays', displays);

		var graphicalInterfaceState = new GraphicalInterfaceState();

		// Get the desired display
		var desiredDisplay = displays[1];

		graphicalInterfaceState.dimensions.width = Position.resolveWidth(settings.width, desiredDisplay.dimensions.width);
		graphicalInterfaceState.dimensions.height = Position.resolveHeight(settings.height, desiredDisplay.dimensions.height);

		graphicalInterfaceState.position.relativeToAllDisplays.x = Position.resolveX(settings.x, graphicalInterfaceState.dimensions.width, desiredDisplay.dimensions.width);
		graphicalInterfaceState.position.relativeToAllDisplays.y = Position.resolveY(settings.y, graphicalInterfaceState.dimensions.height, desiredDisplay.dimensions.height);

		//console.log('x', graphicalInterfaceState.position.relativeToAllDisplays.x);
		//console.log('y', graphicalInterfaceState.position.relativeToAllDisplays.y);
		
		//graphicalInterfaceState.position.relativeToAllDisplays.calculateCoordinatesAndEdges();

		return graphicalInterfaceState;
	}

	static constructFromElectronBrowserWindow(electronBrowserWindow) {
		var graphicalInterfaceState = new GraphicalInterfaceState();

		var bounds = electronBrowserWindow.getBounds();

		graphicalInterfaceState.dimensions.width = bounds.width;
		graphicalInterfaceState.dimensions.height = bounds.height;

		graphicalInterfaceState.position.relativeToAllDisplays.x = bounds.x;
		graphicalInterfaceState.position.relativeToAllDisplays.y = bounds.y;

		return graphicalInterfaceState;
	}

}

// Export
export default GraphicalInterfaceState;
