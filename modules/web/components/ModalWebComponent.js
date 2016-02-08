ModalWebComponent = WebComponent.extend({

	modal: null,

	attributes: {
		class: 'modal-container',
		style: {
			display: 'none',
		},
	},

	construct: function() {
		this.super();

		this.modal = Html.div({
			class: 'modal',
		});

		this.append(this.modal);
	},

});