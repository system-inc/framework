// Dependencies
import HtmlElement from 'system/interface/graphical/web/html/HtmlElement.js';
import Settings from 'system/settings/Settings.js';

// Class
class View extends HtmlElement {

	// Settings for the View
	settings = new Settings();

	viewContainer = null;
	subviews = {};

	// All web elements use a div tag unless otherwise specified
	constructor(options, settings, tag = 'div') {
		// Every View is an HtmlElement
		super(tag, options);

		this.settings.merge(settings);

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
