// Dependencies
import GraphicalInterfaceManager from 'system/interface/graphical/managers/GraphicalInterfaceManager.js';
import HtmlElementViewAdapter from 'system/interface/graphical/views/adapters/HtmlElementViewAdapter.js';

// Class
class ElectronGraphicalInterfaceManager extends GraphicalInterfaceManager {

	getViewAdapter() {
		return new HtmlElementViewAdapter();
	}

}

// Export
export default ElectronGraphicalInterfaceManager;
