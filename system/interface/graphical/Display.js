// Dependencies
import Dimensions from 'framework/system/interface/graphical/Dimensions.js';
import Position from 'framework/system/interface/graphical/Position.js';

// Class
class Display {

	identifier = null;

	dimensions = new Dimensions();
	workAreaDimensions = new Dimensions();
	
	position = {
		relativeToAllDisplays: new Position(),
		workAreaRelativeToAllDisplays: new Position(),
	};

	scaleFactor = null;
	rotation = null;
	touchSupport = null;

}

// Export
export default Display;
