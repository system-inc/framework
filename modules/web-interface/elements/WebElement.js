WebElement = HtmlElement.extend({

	// All web elements use a div tag unless otherwise specified
	tag: 'div',

	// Settings for the WebElement
	settings: null,

	construct: function(settings) {
		this.settings = Settings.default({
		}, settings);

		// Every WebElement is an HtmlElement
		this.super();
	},

	onMountedToDom: function() {
		// Register event listeners
		this.listen();
	},

	// Abstract method
	listen: function() {
		// By default we listen to nothing
	},

});

// Static methods
WebElement.require = function(webElementName) {
	var webElementPath = null;

	if(WebElement.elements.framework.contains(webElementName)) {
		Framework.require('modules', 'web', 'elements', webElementName+'WebElement');
	}
	else {
		Project.require('views', 'elements', webElementName+'WebElement');
	}

	return global[webElementName+'WebElement'];
}

WebElement.elements = {
	// Elements whose code is located in Framework
	framework: [
		'Input',
		'TextInput',
		'TextArea',
		'Notification',
		'Modal',
		'Form',
	],
}