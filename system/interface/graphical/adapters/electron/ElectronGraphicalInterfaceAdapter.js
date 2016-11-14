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

	listen() {
		this.htmlDocument.on('htmlNode.domUpdateExecuted', function(event) {
			this.view.emit('view.rendered', event);
		}.bind(this));

		this.htmlDocument.on('htmlNode.mountedToDom', function(event) {
			this.view.emit('view.initialized', event);
		}.bind(this));
	}

	initialize() {
		app.log('mounting htmldocument to dom');

		// Connect the graphical interface to the view controller's view
		this.htmlDocument.body.append(this.graphicalInterface.viewController.view.adapter.webView);
		
		this.htmlDocument.mountToDom();
	}

}

// Export
export default ElectronGraphicalInterfaceAdapter;
