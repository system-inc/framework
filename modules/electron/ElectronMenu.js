ElectronMenu = Class.extend({

	menu: null,

	construct: function() {
		this.create();
	},

	create: function() {
		throw new Error('Subclasses must implement ElectronMenu.createMenu().');
	},

	update: function() {
		// TODO: https://github.com/atom/electron/issues/528
		// Update just calls this.create() as Electron needs to recreate the entire menu to update menu labels
		this.create();
	},

	show: function() {
		this.menu.popup();
	},

});