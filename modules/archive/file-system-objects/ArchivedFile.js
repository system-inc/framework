ArchivedFile = ArchivedFileSystemObject.extend({

	// Mimic File properties
	file: null,
	fileWithoutExtension: null,
	nameWithoutExtension: null,
	extension: null,

	construct: function(archiveFile, path) {
		this.super.apply(this, arguments);

		this.type = 'file';

		// Use File's constructor to setup class variables based on path
		File.prototype.construct.call(this, this.path);

		// Force all path separators to be forward slashes
		this.path = this.path.replace('\\', '/');
		this.directory = this.directory.replace('\\', '/');
		this.file = this.file.replace('\\', '/');
		this.fileWithoutExtension = this.fileWithoutExtension.replace('\\', '/');
	},

});