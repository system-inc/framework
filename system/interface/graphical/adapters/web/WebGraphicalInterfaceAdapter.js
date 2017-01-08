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
			this.htmlDocument.body.append(this.graphicalInterface.viewController.view.adapter.adaptedView);	
		}
		else {
			app.error('View does not exist for ViewController.');
		}
		
		this.htmlDocument.mountToDom();
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
