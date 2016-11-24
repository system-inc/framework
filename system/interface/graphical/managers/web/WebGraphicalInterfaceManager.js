// Dependencies
import GraphicalInterfaceManager from 'system/interface/graphical/managers/GraphicalInterfaceManager.js';
import WebGraphicalInterfaceAdapter from 'system/interface/graphical/adapters/Web/WebGraphicalInterfaceAdapter.js';
import WebViewAdapter from 'system/interface/graphical/views/adapters/web/WebViewAdapter.js';

// Class
class WebGraphicalInterfaceManager extends GraphicalInterfaceManager {

	createGraphicalInterfaceAdapter(graphicalInterface) {
		return new WebGraphicalInterfaceAdapter(graphicalInterface);
	}

	createViewAdapter(view) {
		return new WebViewAdapter(view);
	}

}

// Export
export default WebGraphicalInterfaceManager;
