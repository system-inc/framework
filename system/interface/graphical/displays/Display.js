// Dependencies
import Dimensions from 'framework/system/interface/graphical/Dimensions.js';
import Position from 'framework/system/interface/graphical/Position.js';

// Class
class Display {

	dimensions = new Dimensions();
	
	position = {
		relativeToAllDisplays: new Position();
	};

}

// Export
export default Display;
