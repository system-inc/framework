// Dependencies
import GraphicalInterfaceAdapter from 'system/interface/graphical/adapters/GraphicalInterfaceAdapter.js';
import HtmlDocument from 'system/interface/graphical/web/html/HtmlDocument.js';

// Class
class ElectronGraphicalInterfaceAdapter extends GraphicalInterfaceAdapter {

	electronBrowserWindow = null;
	htmlDocument = null;

	constructor(graphicalInterface, identifier) {
		super(graphicalInterface);

		app.log('creating HtmlDocument');
		this.htmlDocument = new HtmlDocument();
	}

	initialize() {
		app.log('mounting htmldocument to dom');
		this.htmlDocumen.mountToDom();
	}

}

// Export
export default ElectronGraphicalInterfaceAdapter;
