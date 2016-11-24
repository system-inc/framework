// Dependencies
import WebGraphicalInterfaceManager from 'system/interface/graphical/managers/web/WebGraphicalInterfaceManager.js';
import ElectronGraphicalInterfaceAdapter from 'system/interface/graphical/adapters/electron/ElectronGraphicalInterfaceAdapter.js';

// Class
class ElectronGraphicalInterfaceManager extends WebGraphicalInterfaceManager {

	createGraphicalInterfaceAdapter(graphicalInterface) {
		return new ElectronGraphicalInterfaceAdapter(graphicalInterface);
	}

}

// Export
export default ElectronGraphicalInterfaceManager;
