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

		//console.log('creating HtmlDocument');
		this.htmlDocument = new HtmlDocument();

		// Hook the HtmlDocument's emit function
		var standardHtmlDocumentEmit = this.htmlDocument.emit;
		this.htmlDocument.emit = async function(eventIdentifier, data, eventOptions) {
			if(
				!eventIdentifier.startsWith('input.') &&
				!eventIdentifier.startsWith('htmlDocument.')
			) {
				console.log('this event is being written to local storage - eventIdentifier', eventIdentifier);
				// We also emit the event on the graphical interface
				await this.graphicalInterface.emit.apply(this.graphicalInterface, arguments);
			}

			// Emit the event on the HtmlDocument as normal
			return await standardHtmlDocumentEmit.apply(this.htmlDocument, arguments);
		}.bind(this);

		// Capture resize events
		this.htmlDocument.on('htmlDocument.resize', function(event) {
			this.graphicalInterface.emit('graphicalInterface.resize', event);
			this.graphicalInterface.dimensions = this.htmlDocument.dimensions;
		}.bind(this));

		// Set the dimensions
		this.graphicalInterface.dimensions = this.htmlDocument.dimensions;
		//console.info('this.htmlDocument.dimensions', this.htmlDocument.dimensions);
	}

	initialize() {
		// Connect the graphical interface to the ViewController's view
		if(this.graphicalInterface.viewController && this.graphicalInterface.viewController.view) {
			this.htmlDocument.body.append(this.graphicalInterface.viewController.view.adapter.adaptedView);	
		}
		else {
			console.warn('View does not exist for ViewController.');
		}
		
		//console.log('Mounting HtmlDocument to DOM');
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

	addEventListener(eventPattern, functionToBind, timesToRun) {
		// Don't bind graphical interface events to the document
		if(!eventPattern.startsWith('graphicalInterface.')) {
			this.htmlDocument.addEventListener(...arguments);
		}

		return this;
	}

	getSelection() {
		return this.htmlDocument.getSelection(...arguments);
	}

	insertText() {
		return this.htmlDocument.insertText(...arguments);
	}

	print() {
		return this.htmlDocument.domWindow.print();
	}

}

// Export
export default WebGraphicalInterfaceAdapter;
