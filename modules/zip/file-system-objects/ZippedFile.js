ZippedFile = ZippedFileSystemObject.extend({

	// Mimic File
	file: null,
	fileWithoutExtension: null,
	nameWithoutExtension: null,
	extension: null,

	construct: function() {
		this.super.apply(this, arguments);

		this.type = 'file';

		// Use File's constructor to setup class variables based on path
		File.prototype.construct.call(this, this.path);
	}

});