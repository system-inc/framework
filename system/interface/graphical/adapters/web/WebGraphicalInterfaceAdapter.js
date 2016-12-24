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
		app.log('Mounting HtmlDocument to DOM');

		// Connect the graphical interface to the ViewController's view
		if(this.graphicalInterface.viewController.view) {
			this.htmlDocument.body.append(this.graphicalInterface.viewController.view.adapter.webView);	
		}
		else {
			app.warn('View does not exist for ViewController.');
		}
		
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

	addScript() {
		this.htmlDocument.addScript(...arguments);
	}

	addStyleSheet() {
		this.htmlDocument.addStyleSheet(...arguments);
	}

}

// Export
export default WebGraphicalInterfaceAdapter;
