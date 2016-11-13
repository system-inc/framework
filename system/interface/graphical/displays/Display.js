// Dependencies
import Dimensions from 'system/interface/graphical/Dimensions.js';
import Position from 'system/interface/graphical/Position.js';

// Class
class Display {

	dimensions = new Dimensions();
	
	position = {
		relativeToAllDisplays: new Position();
	};

}

// Export
export default Display;
