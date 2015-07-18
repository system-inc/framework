ZippedDirectory = ZippedFileSystemObject.extend({

	construct: function() {
		this.super.apply(this, arguments);

		this.type = 'directory';

		// Use Directory's constructor to setup class variables based on path
		Directory.prototype.construct.call(this, this.path);
	}

});