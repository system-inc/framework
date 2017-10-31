// Dependencies
import Dimensions from 'framework/system/interface/graphical/Dimensions.js';
import Position from 'framework/system/interface/graphical/Position.js';

// Class
class GraphicalInterfaceState {

	title = null;

	type = null;
	show = null;
	openDeveloperTools = null;

	dimensions = new Dimensions();

	position = {
		relativeToDisplay: new Position(),
		relativeToAllDisplays: new Position(),
	};

	//closed = null;
	//fullscreen = null;
	//backgroundColor = null;
	//useContentDimensions = null;
	//resizable = null;
	//movable = null;
	//minimizable = null;
	//maximizable = null;
	//fullscreenable = null;
	//closable = null;
	//focusable = null;
	//alwaysOnTop = null;

	static getSettingsWithDisplays(type = null, displays) {
		var settings = null;
		var defaultSettings = app.settings.get('interfaces.graphical.defaults');

		// If the user specified a type for the interface
		if(type) {
			// Merge the type settings with the default settings
			var typeSettings = app.settings.get('interfaces.graphical.types.'+type);
			settings = defaultSettings.merge(typeSettings);
		}
		// If no type
		else {
			// If a numbered display key is set that matches the number of monitors
			var displaysLength = Object.keys(displays).length;
			var displaysLengthInEnglish = Number.toEnglish(displaysLength);
			//console.log('displaysLengthInEnglish', displaysLengthInEnglish);

			var numberedDisplaySettingsKey = displaysLengthInEnglish + 'Display';
			if(displaysLength > 1) {
				numberedDisplaySettingsKey += 's';
			}
			//console.log('numberedDisplaySettingsKey', numberedDisplaySettingsKey);

			var numberedDisplaySettings = app.settings.get('interfaces.graphical.'+numberedDisplaySettingsKey);

			// Use the numbered display settings merged with the defaults
			if(numberedDisplaySettings) {
				settings = defaultSettings.merge(numberedDisplaySettings);
			}
			// Just use the defaults
			else {
				settings = defaultSettings;
			}
		}

		//console.info('GraphicalInterfaceState settings', settings);

		return settings;
	}

	static constructFromSettingsWithDisplays(settings, displays, type = null) {
		//console.info('constructFromSettingsWithDisplays', 'settings', settings, 'displays', displays, 'type', type);

		var graphicalInterfaceState = new GraphicalInterfaceState();

		var desiredDisplay = displays[settings.display];
		//console.log('desiredDisplay', desiredDisplay);

		graphicalInterfaceState.title = app.title;

		graphicalInterfaceState.type = type;
		graphicalInterfaceState.show = settings.show;
		graphicalInterfaceState.openDeveloperTools = settings.openDeveloperTools;

		graphicalInterfaceState.dimensions.width = Math.floor(Position.resolveWidth(settings.width, desiredDisplay.workAreaDimensions.width));
		//console.info('width', graphicalInterfaceState.dimensions.width);
		graphicalInterfaceState.dimensions.height = Math.floor(Position.resolveHeight(settings.height, desiredDisplay.workAreaDimensions.height));
		//console.info('height', graphicalInterfaceState.dimensions.height);

		//console.log(settings.x, graphicalInterfaceState.dimensions.width, desiredDisplay.dimensions.width);
		graphicalInterfaceState.position.relativeToAllDisplays.x = Math.floor(Position.resolveX(settings.x, graphicalInterfaceState.dimensions.width, desiredDisplay.dimensions.width));
		//console.info('x for display', graphicalInterfaceState.position.relativeToAllDisplays.x);
		graphicalInterfaceState.position.relativeToAllDisplays.x = Math.floor(graphicalInterfaceState.position.relativeToAllDisplays.x + desiredDisplay.position.relativeToAllDisplays.x);
		//console.info('x for all displays', graphicalInterfaceState.position.relativeToAllDisplays.x);

		//console.log(settings.y, graphicalInterfaceState.dimensions.height, desiredDisplay.dimensions.height);
		graphicalInterfaceState.position.relativeToAllDisplays.y = Math.floor(Position.resolveY(settings.y, graphicalInterfaceState.dimensions.height, desiredDisplay.dimensions.height));
		//console.info('y for display', graphicalInterfaceState.position.relativeToAllDisplays.y);
		graphicalInterfaceState.position.relativeToAllDisplays.y = Math.floor(graphicalInterfaceState.position.relativeToAllDisplays.y + desiredDisplay.position.relativeToAllDisplays.y);
		//console.info('y for all displays', graphicalInterfaceState.position.relativeToAllDisplays.y);

		// Temporary hack to fix Windows 10 browser window sizing issues until Electron is fixed
		// Windows 10 Browser Window Bounds Calculating Incorrectly #4045
		// TODO: https://github.com/atom/electron/issues/4045
		if(app.onWindows() && Node.OperatingSystem.release().startsWith('10.')) {
			graphicalInterfaceState.position.relativeToAllDisplays.x = graphicalInterfaceState.position.relativeToAllDisplays.x - 7;
			graphicalInterfaceState.dimensions.width = graphicalInterfaceState.dimensions.width + 14;
			graphicalInterfaceState.dimensions.height = graphicalInterfaceState.dimensions.height + 7;
		}
		
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
