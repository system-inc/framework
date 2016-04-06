// Dependencies
var View = Framework.require('system/web-interface/views/View.js');

// Class
var FormView = View.extend({

	tag: 'form',

	attributes: {
		class: 'form',
		style: {
			display: 'none',
		},
	},

	construct: function(settings) {
		this.super.apply(this, arguments);
		this.settings.setDefaults({
			cancelButton: {

			},

		});
	},

	addField: function() {

	},

	removeField: function() {

	},

	getData: function() {

	},

	validate: function() {

	},

	submit: function() {
		this.emit('submit', this.getData());
	},

});

// Export
module.exports = FormView;