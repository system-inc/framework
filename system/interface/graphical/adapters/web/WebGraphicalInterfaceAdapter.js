// Dependencies
import GraphicalInterfaceAdapter from 'framework/system/interface/graphical/adapters/GraphicalInterfaceAdapter.js';
import HtmlDocument from 'framework/system/interface/graphical/web/html/HtmlDocument.js';

// Class
class WebGraphicalInterfaceAdapter extends GraphicalInterfaceAdapter {

	htmlDocument = null;

	constructor(graphicalInterface, identifier) {
		super(graphicalInterface);

		app.log('creating HtmlDocument');
		this.htmlDocument = new HtmlDocument();
	}

	initialize() {
		app.log('mounting htmldocument to dom');

		// Connect the graphical interface to the view controller's view
		this.htmlDocument.body.append(this.graphicalInterface.viewController.view.adapter.webView);
		
		this.htmlDocument.mountToDom();
	}

	listen() {
		this.htmlDocument.on('htmlNode.domUpdateExecuted', function(event) {
			this.view.emit('view.rendered', event);
		}.bind(this));

		this.htmlDocument.on('htmlNode.mountedToDom', function(event) {
			this.view.emit('view.initialized', event);
		}.bind(this));
	}

}

// Export
export default WebGraphicalInterfaceAdapter;
