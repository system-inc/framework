require('./FileSystem');
require('./FileSystemObject');
require('./Directory');
require('./File');
require('./FileFormats');

FileSystemModuleClass = Module.extend({

	version: new Version('1.0'),

	construct: function(settings) {
		this.super(settings);
	},
	
});