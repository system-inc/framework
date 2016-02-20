ModalWebElement = WebElement.extend({

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
	},

});