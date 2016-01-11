WebComponent = Class.extend({

	// Every web component must have an HtmlElement
	element: null,

	// Settings for the web component
	settings: null,

	construct: function(settings) {
		this.settings = Settings.default({
			// The default element tag for a web component is div
			elementTag: 'div',
		}, settings);

		// Initialize the component when the DOM document is ready
		HtmlDocument.on('ready', function() {
			this.initialize();
		}.bind(this));
	},

	initialize: function() {
		// Every web component must have an HtmlElement
		this.element = new HtmlElement(this.settings.get('elementTag'));
	},

	// Called when the WebComponent is added to the DOM
	render: function() {
	},

	toString: function() {
		return this.element.toString();
	},

});

// Static methods
WebComponent.load = function(webComponentName) {
	var webComponentPath = null;

	if(WebComponent.components.core.contains(webComponentName)) {
		webComponentPath = Node.Path.join(Project.framework.directory, 'modules', 'web', 'components', webComponentName+'WebComponent.js');	
	}
	else {
		webComponentPath = Node.Path.join(Project.directory, 'components', webComponentName+'WebComponent.js');	
	}
	//console.log(webComponentPath);

	return Framework.require(webComponentPath);
}

WebComponent.components = {
	// Components whose code is located in Framework
	core: [
		'Input',
		'TextInput',
		'TextArea',
		'Notification',		
	],
	// TODO: Keep track of loaded components
	loaded: [],
	// TODO: Keep track of initialized components
	initialized: [],
}