WebComponent = Class.extend({

	document: null,

	content: [],

	settings: null,
	
	data: null,

	construct: function(settings) {
		this.settings = new Settings(settings);
	},

	initialize: function() {

	},

	toString: function() {
		var string = '';

		this.content.each(function(index, stringOrElement) {
			string += stringOrElement.toString(indent);
		});

		return string;
	},

});