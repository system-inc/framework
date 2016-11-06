// Dependencies
import PropagatingEventEmitter from 'system/events/PropagatingEventEmitter.js';

// Class
class View extends PropagatingEventEmitter {

	adapter = null;
	graphicalInterface = null;
	subviews = {};

	// todo: stuff from event emitter
	// todo: stuff from htmleventemitter
	// todo: stuff from htmlelement
	// todo: stuff from htmlnode


	parent = null;
	child = null;



	constructor() {
		super();

		this.adapter = app.interfaces.graphicalInterfaceManager.getViewAdapter(this);
	}

	// All web elements use a div tag unless otherwise specified
	constructor(options, settings, tag = 'div') {
		// Every View is an HtmlElement
		super(tag, options);

		this.settings.merge(settings);

		// Set the viewContainer alias
		this.graphicalInterface = app.interfaces.graphicalInterfaceManager.getCurrentGraphicalInterface();

		// Emit htmlNode.mountedToDom events as view.initialized
		this.on('htmlNode.mountedToDom', function(event) {
			// May need to set the alias again here
			this.viewContainer = this.htmlDocument;

			this.emit('view.initialized', event);
		}.bind(this));
	}

	createSubviews() {
	}

}

// Export
export default View;
