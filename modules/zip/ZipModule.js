ZipModule = Module.extend({

	version: new Version('0.1.0'),

	uses: [
		'ZipFile',
		'ZipFileSystemObjectReference',
	],

	construct: function(moduleName) {
		this.super.apply(this, arguments);
	},
	
});