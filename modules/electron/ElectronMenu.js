ElectronMenu = Class.extend({

	menu: null,

	construct: function() {
		this.createMenu();
	},

	createMenu: function() {
		throw new Error('Subclasses must implement ElectronMenu.createMenu()');
	},

	show: function() {
		this.menu.popup();
	},

});