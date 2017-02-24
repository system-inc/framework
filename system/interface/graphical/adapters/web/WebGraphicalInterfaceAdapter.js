// Dependencies
import GraphicalInterfaceAdapter from 'framework/system/interface/graphical/adapters/GraphicalInterfaceAdapter.js';
import HtmlDocument from 'framework/system/interface/graphical/web/html/HtmlDocument.js';
import WebViewAdapter from 'framework/system/interface/graphical/views/adapters/web/WebViewAdapter.js';
import Display from 'framework/system/interface/graphical/Display.js';

// Class
class WebGraphicalInterfaceAdapter extends GraphicalInterfaceAdapter {

	htmlDocument = null;

	constructor(graphicalInterface) {
		super(graphicalInterface);

		//app.log('creating HtmlDocument');
		this.htmlDocument = new HtmlDocument();
	}

	initialize() {
		// Connect the graphical interface to the ViewController's view
		if(this.graphicalInterface.viewController.view) {
			this.htmlDocument.body.append(this.graphicalInterface.viewController.view.adapter.adaptedView);	
		}
		else {
			app.error('View does not exist for ViewController.');
		}
		
		//app.log('Mounting HtmlDocument to DOM');
		this.htmlDocument.mountToDom();
	}

	createViewAdapter(view) {
		return new WebViewAdapter(view);
	}

	initializeDisplays() {
		console.log('WebGraphicalInterfaceAdapter initializeDisplays');

		var display = new Display();
		display.dimensions.width = window.screen.width;
		display.dimensions.height = window.screen.width;

		this.graphicalInterface.display = display;
		this.graphicalInterface.displays = {
			1: display,
		};
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
