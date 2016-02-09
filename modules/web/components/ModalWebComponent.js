ModalWebComponent = WebComponent.extend({

	modal: null,

	attributes: {
		class: 'modalContainer',
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

		console.warn('missing .domElement reference, need to figure out why:')
		console.warn('this.modal.domElement', this.modal.domElement, this.modal);
	},

});