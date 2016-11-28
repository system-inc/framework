// Dependencies
import GraphicalInterfaceManager from 'framework/system/interface/graphical/managers/GraphicalInterfaceManager.js';
import WebGraphicalInterfaceAdapter from 'framework/system/interface/graphical/adapters/Web/WebGraphicalInterfaceAdapter.js';
import WebViewAdapter from 'framework/system/interface/graphical/views/adapters/web/WebViewAdapter.js';

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
