// Dependencies
import HtmlElement from './../../../system/html/HtmlElement.js';
import Settings from './../../../system/settings/Settings.js';

// Class
class View extends HtmlElement {

	// All web elements use a div tag unless otherwise specified
	tag = 'div';

	// Settings for the View
	settings = new Settings();

	viewContainer = null;
	subviews = {};

	construct(options, settings) {
		this.settings.merge(settings);

		// Every View is an HtmlElement
		this.super(this.tag, options);

		// Set the viewContainer alias
		this.viewContainer = this.htmlDocument;

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
