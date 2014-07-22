require('./FileSystem');
require('./FileSystemObject');
require('./Directory');
require('./File');
require('./FileFormats');

FileSystemModuleClass = Module.extend({

	version: null,

	construct: function(settings) {
		this.super(settings);
		this.version = new Version('1.0');
	},
	
});