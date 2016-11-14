// Dependencies
import GraphicalInterfaceManager from 'system/interface/graphical/managers/GraphicalInterfaceManager.js';
import ElectronGraphicalInterfaceAdapter from 'system/interface/graphical/adapters/electron/ElectronGraphicalInterfaceAdapter.js';
import WebViewAdapter from 'system/interface/graphical/views/adapters/web/WebViewAdapter.js';

// Class
class ElectronGraphicalInterfaceManager extends GraphicalInterfaceManager {

	getGraphicalInterfaceAdapter(graphicalInterface) {
		return new ElectronGraphicalInterfaceAdapter(graphicalInterface);
	}

	getViewAdapter(view) {
		return new WebViewAdapter(view);
	}

}

// Export
export default ElectronGraphicalInterfaceManager;
