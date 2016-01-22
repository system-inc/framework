WebComponent = HtmlElement.extend({

	// All web components use a div tag unless otherwise specified
	tag: 'div',

	// Settings for the WebComponent
	settings: null,

	construct: function(settings) {
		this.settings = Settings.default({
		}, settings);

		// Every WebComponent is an HtmlElement
		this.super();
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